use reqwest;
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
struct GeminiRequest {
    contents: Vec<Content>,
}

#[derive(Serialize)]
struct Content {
    parts: Vec<Part>,
}

#[derive(Serialize)]
struct Part {
    text: String,
}

#[derive(Deserialize)]
struct GeminiResponse {
    candidates: Option<Vec<Candidate>>,
}

#[derive(Deserialize)]
struct Candidate {
    content: CandidateContent,
}

#[derive(Deserialize)]
struct CandidateContent {
    parts: Vec<ResponsePart>,
}

#[derive(Deserialize)]
struct ResponsePart {
    text: String,
}

pub async fn generate_retrospective(
    api_key: &str,
    activities: &str,
    tone: &str,
    custom_tone: &str,
    language: &str,
) -> Result<String, Box<dyn std::error::Error + Send + Sync>> {
    let prompt = build_prompt(activities, tone, custom_tone, language);

    let client = reqwest::Client::new();
    let url = format!(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={}",
        api_key
    );

    let request = GeminiRequest {
        contents: vec![Content {
            parts: vec![Part { text: prompt }],
        }],
    };

    let response = client
        .post(&url)
        .json(&request)
        .send()
        .await?;

    if !response.status().is_success() {
        let status = response.status();
        let body = response.text().await.unwrap_or_default();
        return Err(format!("Gemini API error ({}): {}", status, body).into());
    }

    let gemini_resp = response.json::<GeminiResponse>().await?;

    let text = gemini_resp
        .candidates
        .and_then(|c| c.into_iter().next())
        .and_then(|c| c.content.parts.into_iter().next())
        .map(|p| p.text)
        .ok_or("Gemini returned empty response")?;

    Ok(text)
}

fn build_prompt(activities: &str, tone: &str, custom_tone: &str, language: &str) -> String {
    let tone_instruction = match tone {
        "diary" => "1인칭 일기체로 편안하게".to_string(),
        "blog" => "개발자 블로그 포스트 톤으로 전문적이면서 읽기 쉽게".to_string(),
        "bullet" => "불렛 포인트 중심으로 간결하게".to_string(),
        "custom" if !custom_tone.is_empty() => custom_tone.to_string(),
        _ => "1인칭 일기체로 편안하게".to_string(),
    };

    let lang_instruction = match language {
        "ko" => "한국어로 작성하세요.",
        "en" => "Write in English.",
        _ => "한국어로 작성하세요.",
    };

    format!(
        "당신은 전문 기술 블로거입니다. 아래의 활동 로그를 바탕으로 오늘 하루를 정리하는 '풍성한 회고글'을 작성하세요.\n\n\
        지침:\n\
        1. 스타일: {tone_instruction}. 리스트 위주가 아닌, \"오늘은 ~를 했다. 특히 ~ 부분이 인상 깊었다\"와 같은 자연스러운 서술형 톤으로 쓰세요.\n\
        2. 데이터 엄격성: 로그에 없는 도구나 앱은 절대 언급하지 마세요. 오직 로그에 있는 내용만 사용하세요.\n\
        3. 구조: 크게 2~4개의 테마 섹션으로 나누고, 각 섹션은 '### 제목'으로 시작하세요. 관련 활동끼리 묶어 정리하세요.\n\
        4. 인사이트: 단순 나열이 아니라, 해당 작업이 어떤 의미가 있었을지 개발자 관점에서 해석을 덧붙여주세요.\n\
        5. 윈도우 타이틀 활용: [앱이름] 뒤의 윈도우 타이틀을 적극 활용하세요. 어떤 사이트를 방문했고, 어떤 파일을 열었고, 어떤 프로젝트를 작업했는지 구체적으로 서술하세요.\n\
        6. AI 티 방지: \"알찬 하루\", \"보람찬\", \"오늘 하루도 열심히\" 같은 상투적 표현은 사용하지 마세요.\n\
        7. {lang_instruction}\n\
        8. 마크다운 형식 (## 큰 제목, ### 테마별 소제목, 본문 서술)\n\
        9. 500자 이상, 3000자 이하로 충분히 길고 상세하게 작성하세요.\n\
        10. 마지막에 하루를 돌아보는 짧은 소감으로 자연스럽게 마무리하세요.\n\n\
        활동 로그:\n{activities}"
    )
}
