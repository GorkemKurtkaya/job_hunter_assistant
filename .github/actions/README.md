# 🚀 GitHub Actions CI/CD Kullanım Kılavuzu

## 📋 Genel Bakış

Bu proje için 3 farklı CI/CD pipeline kurulmuştur:

1. **Frontend CI/CD** (`frontend-ci.yml`)
2. **Backend CI/CD** (`backend-ci.yml`) 
3. **Full Project CI/CD** (`full-project-ci.yml`)

## 🔄 Nasıl Çalışır?

### Otomatik Tetikleme
- `main` veya `develop` branch'ine push yapıldığında
- Pull Request oluşturulduğunda
- Manuel olarak GitHub Actions sekmesinden

### Pipeline Adımları

#### Frontend Pipeline:
1. ✅ Kod checkout
2. 🔧 Node.js kurulumu
3. 📦 Bağımlılık kurulumu
4. 🧹 Linting
5. 🔍 Type checking
6. 🏗️ Build işlemi
7. 📤 Artifact upload

#### Backend Pipeline:
1. ✅ Kod checkout
2. 🔧 Node.js kurulumu
3. 📦 Bağımlılık kurulumu
4. 🔒 Güvenlik audit
5. 🚨 Vulnerability check
6. 📤 Artifact upload
7. 🚀 Staging/Production deploy

## 🛠️ Kullanım

### 1. GitHub Repository'de Actions Sekmesine Git
```
https://github.com/[username]/[repo-name]/actions
```

### 2. Workflow'ları İzle
- Yeşil ✅ = Başarılı
- Kırmızı ❌ = Başarısız
- Sarı 🟡 = Çalışıyor

### 3. Manuel Tetikleme
```yaml
workflow_dispatch: # Manuel tetikleme için
```

## 🔧 Özelleştirme

### Environment Variables
GitHub repository'de Settings > Secrets and variables > Actions kısmından:

```bash
# Backend için
BACKEND_HOST=your-server.com
BACKEND_USER=deploy-user
BACKEND_KEY=ssh-private-key

# Frontend için  
FRONTEND_DEPLOY_URL=https://your-app.vercel.app
VERCEL_TOKEN=your-vercel-token
```

### Branch Protection
`main` branch'i korumak için:
1. Settings > Branches
2. Add rule
3. Require status checks to pass before merging
4. Require branches to be up to date

## 📊 Monitoring

### Slack/Discord Notification
```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Email Notification
```yaml
- name: Send email
  uses: dawidd6/action-send-mail@v3
  with:
    to: team@company.com
    subject: "CI/CD Pipeline: ${{ job.status }}"
```

## 🚨 Sorun Giderme

### Yaygın Hatalar:
1. **Node version mismatch**: `node-version` güncelle
2. **Permission denied**: Repository permissions kontrol et
3. **Timeout**: `timeout-minutes` ekle
4. **Memory issues**: `runs-on: ubuntu-latest` kullan

### Debug:
```yaml
- name: Debug info
  run: |
    echo "Node version: $(node --version)"
    echo "NPM version: $(npm --version)"
    echo "Working directory: $(pwd)"
    echo "Files: $(ls -la)"
```

## 📈 Best Practices

1. **Cache kullan**: `actions/cache` ile npm cache
2. **Matrix builds**: Farklı Node.js versiyonları için
3. **Conditional jobs**: `if` statements ile
4. **Artifacts**: Build çıktılarını sakla
5. **Security**: Secrets kullan, hardcode yapma

## 🔗 Faydalı Linkler

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Node.js Setup Action](https://github.com/actions/setup-node)
- [Cache Action](https://github.com/actions/cache)
- [Upload Artifacts](https://github.com/actions/upload-artifact)
