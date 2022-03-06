import { execSync } from "child_process";

execSync(
  'git config --global user.name "Traffic Bot" \
  && git config --global user.email "trafficbot@users.noreply.github.com" \
  && git add . \
  && git commit -am "patch:add traffic data" \
  && git push'
);
