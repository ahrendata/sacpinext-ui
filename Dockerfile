FROM fabric8/fabric8-openshift-nginx:vd83b3a1

USER root

RUN rm -rf /usr/share/nginx/html/
COPY dist /usr/share/nginx/html
RUN chmod -R 777 /usr/share/nginx/html/

USER fabric8
