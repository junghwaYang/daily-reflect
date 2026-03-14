#!/bin/bash
echo ""
echo "=================================="
echo "  Daily Reflect - macOS 설치 도우미"
echo "=================================="
echo ""

APP_PATH="/Applications/Daily Reflect.app"

if [ ! -d "$APP_PATH" ]; then
    echo "❌ Daily Reflect가 /Applications 폴더에 없습니다."
    echo "   먼저 .dmg 파일에서 앱을 Applications 폴더로 드래그하세요."
    echo ""
    read -p "아무 키나 눌러 종료..."
    exit 1
fi

echo "🔧 macOS Gatekeeper 제한을 해제합니다..."
xattr -cr "$APP_PATH"

echo "✅ 완료! 이제 Daily Reflect를 정상적으로 실행할 수 있습니다."
echo ""
echo "🚀 앱을 실행합니다..."
open "$APP_PATH"
echo ""
