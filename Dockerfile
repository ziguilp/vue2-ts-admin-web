FROM node:16.20 as dist
# RUN yarn config set registry https://registry.npm.taobao.org/
WORKDIR /tmp
COPY package.json yarn.lock tsconfig.json babel.config.js postcss.config.js vue.config.js  ./
COPY src ./src
COPY public ./public
RUN yarn
RUN yarn build 

FROM nginx
VOLUME /tmp
ENV LANG en_US.UTF-8
RUN rm -rf /usr/share/nginx/html/*
ADD ./nginx/conf.d/ /etc/nginx/conf.d/
ADD ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=dist /tmp/dist /usr/share/nginx/html/
# ADD ./dist/ /usr/share/nginx/html/
EXPOSE 80
EXPOSE 443
