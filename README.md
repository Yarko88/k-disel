# K-Diesel — сайт (Vite + React)

Статический фронтенд: после сборки в каталоге `dist` лежат HTML/CSS/JS и файлы из `public/` (видео, музыка).

## Требования (Ubuntu и любая ОС)

- **Node.js** ≥ 20.19 (в репозитории зафиксирована **22** в `.nvmrc` — удобно с [nvm](https://github.com/nvm-sh/nvm)).

```bash
# Пример на Ubuntu
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# перезайти в shell, затем:
cd /path/to/k-disel
nvm install
nvm use
npm ci
npm run build   # результат → dist/
```

Проверка прод-сборки локально: `npm run preview` (слушает `0.0.0.0:4173`).

Разработка: `npm run dev` (порт `5173`, хост `0.0.0.0` — можно открыть с другой машины в сети).

## Деплой через Git

### Вариант A — GitHub + GitHub Actions

1. Запушьте репозиторий на GitHub.
2. **CI** (`.github/workflows/ci.yml`): на каждый push/PR на Ubuntu выполняется `npm ci` и `npm run build`, артефакт `dist` прикладывается к прогону.
3. **GitHub Pages** (`.github/workflows/deploy-github-pages.yml`): при push в ветку `main` собирается проект с `VITE_BASE=/<имя-репо>/` и выкладывается на Pages.
   - В репозитории: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
   - Сайт будет вида `https://<user>.github.io/<repo>/`.
4. Если репозиторий специальный `username.github.io` (сайт с корня домена), в workflow для сборки задайте `VITE_BASE: /` вместо текущего значения.

Медиафайлы в `public/` должны быть в git (или подключены иначе), иначе в CI не попадут в `dist`.

### Вариант B — GitLab

Файл `.gitlab-ci.yml`: стадия `build` на образе `node:22-bookworm`, артефакт `dist`. Подключите Pages в настройках проекта или заберите `dist` своим пайплайном.

### Вариант C — свой сервер (Ubuntu + nginx)

На сервере:

```bash
sudo apt update && sudo apt install -y git nginx
# Node — как выше (nvm) или из NodeSource / пакета дистрибутива
cd /var/www
sudo git clone <url> k-disel && sudo chown -R "$USER:$USER" k-disel
cd k-disel
nvm use 2>/dev/null || true
npm ci
npm run build   # VITE_BASE не задаём — корень сайта /
sudo cp -r dist/* /var/www/html/   # или отдельный root под сервер
```

Пример `server` в nginx: `root /var/www/html;`, `try_files $uri $uri/ /index.html;` для SPA.

Обновление после `git push`:

```bash
cd /var/www/k-disel && git pull && npm ci && npm run build && sudo rsync -a --delete dist/ /var/www/html/
```

### Вариант D — автодеплой на VM через GitHub Actions (SSH)

Workflow: `.github/workflows/deploy-vm.yml`

На каждый push в `main/master` он подключается к VM по SSH и выполняет:

1. `git pull --ff-only`
2. `npm ci`
3. `npm run build`
4. (опционально) `rsync dist/` в каталог, где смотрит nginx
5. (опционально) ваш пост-командный шаг, например `sudo systemctl reload nginx`

Нужные secrets в GitHub:

- `VM_HOST` — IP или домен VM
- `VM_USER` — пользователь для SSH
- `VM_SSH_KEY` — приватный SSH ключ (многострочный)
- `VM_PATH` — путь к репозиторию на VM (например `/home/deploy/apps/k-disel`)

Опционально:

- `VM_PORT` — порт SSH (по умолчанию `22`)
- `VM_PUBLIC_PATH` — путь публикации статических файлов (например `/var/www/k-disel`)
- `VM_POST_DEPLOY` — команда после публикации (например `sudo systemctl reload nginx`)

Важно:

- `deploy-vm` job автоматически пропускается, пока обязательные secrets не добавлены.
- На VM должны быть установлены: `git`, `node`/`nvm`, `npm`, `rsync` (если используете `VM_PUBLIC_PATH`).

## Переменная `VITE_BASE`

| Куда выкладываете | Значение |
|-------------------|----------|
| Корень домена / VPS | не задавать (по умолчанию `/`) |
| GitHub Pages `…/github.io/<repo>/` | `/<repo>/` (уже в workflow деплоя) |
