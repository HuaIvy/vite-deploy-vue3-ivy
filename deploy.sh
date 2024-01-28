#! deploy.sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://HuaIvy.github.io
# git push -f git@github.com:HuaIvy/HuaIvy.github.io.git master

# if you are deploying to https://HuaIvy.github.io/<REPO>
git push -f git@github.com:huaivy/vite-deploy-vue3-ivy.git master:gh-pages

cd -