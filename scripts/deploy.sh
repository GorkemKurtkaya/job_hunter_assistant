# 🚀 Job Hunter Assistant Deploy Script
# Bu script GitHub Actions tarafından kullanılır

set -e  # Hata durumunda script'i durdur

echo "🚀 Deploy başlatılıyor..."

# Environment variables kontrol et
if [ -z "$DEPLOY_ENV" ]; then
    echo "❌ DEPLOY_ENV environment variable tanımlanmamış"
    exit 1
fi

if [ -z "$DEPLOY_HOST" ]; then
    echo "❌ DEPLOY_HOST environment variable tanımlanmamış"
    exit 1
fi

echo "📍 Deploy ortamı: $DEPLOY_ENV"
echo "🌐 Deploy host: $DEPLOY_HOST"

# Frontend deploy
if [ "$DEPLOY_ENV" = "production" ] || [ "$DEPLOY_ENV" = "staging" ]; then
    echo "🎨 Frontend deploy ediliyor..."
    
    # Build artifacts'ı indir
    if [ -d "frontend-build" ]; then
        echo "📦 Frontend build artifacts bulundu"
    else
        echo "❌ Frontend build artifacts bulunamadı"
        exit 1
    fi
    
    # Vercel deploy (örnek)
    if [ ! -z "$VERCEL_TOKEN" ]; then
        echo "🚀 Vercel'e deploy ediliyor..."
        # vercel --token $VERCEL_TOKEN --prod
    fi
fi

# Backend deploy
if [ "$DEPLOY_ENV" = "production" ] || [ "$DEPLOY_ENV" = "staging" ]; then
    echo "⚙️ Backend deploy ediliyor..."
    
    # SSH ile sunucuya bağlan
    if [ ! -z "$SSH_PRIVATE_KEY" ]; then
        echo "🔑 SSH ile sunucuya bağlanılıyor..."
        
        # Private key'i dosyaya yaz
        echo "$SSH_PRIVATE_KEY" > /tmp/deploy_key
        chmod 600 /tmp/deploy_key
        
        # Deploy komutları
        ssh -i /tmp/deploy_key -o StrictHostKeyChecking=no $DEPLOY_USER@$DEPLOY_HOST << 'EOF'
            echo "🔄 Sunucuda deploy işlemi başlatılıyor..."
            
            # Proje dizinine git
            cd /var/www/job-hunter-assistant
            
            # Git pull
            git pull origin main
            
            # Dependencies kur
            cd backend
            npm ci --production
            
            # PM2 restart
            pm2 restart job-hunter-backend || pm2 start app.js --name job-hunter-backend
            
            # Nginx reload
            sudo systemctl reload nginx
            
            echo "✅ Backend deploy tamamlandı!"
EOF
        
        # Private key'i temizle
        rm -f /tmp/deploy_key
    else
        echo "⚠️ SSH_PRIVATE_KEY tanımlanmamış, backend deploy atlanıyor"
    fi
fi

echo "🎉 Deploy tamamlandı!"
echo "📊 Durum: $DEPLOY_ENV ortamına başarıyla deploy edildi"

# Health check
if [ "$DEPLOY_ENV" = "production" ]; then
    echo "🏥 Health check yapılıyor..."
    sleep 10
    
    # Frontend health check
    if curl -f "$FRONTEND_URL/health" > /dev/null 2>&1; then
        echo "✅ Frontend health check başarılı"
    else
        echo "❌ Frontend health check başarısız"
    fi
    
    # Backend health check
    if curl -f "$BACKEND_URL/health" > /dev/null 2>&1; then
        echo "✅ Backend health check başarılı"
    else
        echo "❌ Backend health check başarısız"
    fi
fi
