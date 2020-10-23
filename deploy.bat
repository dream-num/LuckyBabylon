# deploy Demo
npm run build
cd dist
git init
git remote add origin https://github.com/mengshukeji/LuckyBabylonDemo.git
git add .
git commit -m 'deploy LuckyBabylon demo'
git push -f origin master:gh-pages