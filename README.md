# CI/CD Pipeline

### Bu proje, yazılım geliştirme süreçlerinin otomatikleştirilmesi ve yönetilmesi amacıyla Continuous Integration (CI) ve Continuous Delivery (CD) pratiklerini uygulayan bir pipeline mimarisi sunmaktadır. Bu mimari, kodun geliştirilmesinden canlı ortama dağıtımına kadar olan tüm süreci kapsar.
![Architecture-Hande](https://github.com/user-attachments/assets/af32f3b0-b778-47ba-b205-15acd14b7773)

### Kullanılan Teknolojiler ve Araçlar
* **Visual Studio Code (VSCode):** Kod geliştirme ortamı.
* **GitHub:** Versiyon kontrol sistemi.
* **Jenkins:** CI/CD süreçlerini otomatikleştiren araç.
* **Snyk:** Güvenlik açıklarını tespit eden araç.
* **Docker:** Konteyner teknolojisi.
* **Kubernetes:** Konteyner orkestrasyon platformu.
* **Selenium:** Otomatik test aracı.
* **Prometheus & Grafana:** İzleme ve gözlemleme araçları.
* **ELK Stack:** Log yönetimi ve analiz platformu.
* **Velero:** Kubernetes yedekleme ve geri yükleme aracı.

# Jenkins
![image](https://github.com/user-attachments/assets/1d1c1046-2dd7-4ad4-882b-128310ebe830)
Google Cloud'da Compute Engine kısmında bir vm oluşturduk. Ardından bu Vm'in içerisine Jenkins kurulumu yaptık. Jenkins pipeline'ımızı oluşturduk ve ana mimaride görüldüğü gibi CI kısmını tamamladık. 

## Jenkinsfile nasıl yazılır
Jenkinsfile , pipeline adımlarını ve her adımda neler yapılacağını belirtir.

**pipeline** : pipeline’ı tanımlar içerisinde bir pipeline yapılacağını belirtir.

- agent
- stages
- post

gibi bileşenlerden oluşur.

**agent any**: Pipeline'ın herhangi bir uygun ajan üzerinde çalışabileceğini belirtir. Ajan, Jenkins'in pipeline'ı çalıştırdığı bir makinedir.

**stages**: Pipeline'ın aşamalarını tanımlar. Her aşama (stage), belirli bir işi gerçekleştirir.

**post**: Pipeline tamamlandıktan sonra çalışacak adımları tanımlar. always bloğu, pipeline'ın sonucundan bağımsız olarak her zaman çalışacak adımları içerir.

# ArgoCD

![image](https://github.com/user-attachments/assets/657fe45e-bbfd-475b-a83a-12c4e5b7c4d1)

ArgoCD, Git deposundaki tanımlamalara dayanarak Kubernetes uygulamalarını otomatik olarak dağıtır. Bu, manuel müdahale olmadan sürekli teslimat süreçlerinin sorunsuz bir şekilde yürütülmesini sağlar.Uygulamalarımızın Kubernetes üzerinde sürekli olarak güncellenmesi, ArgoCD tarafından yönetilmektedir. Bu sayede, her kod değişikliği Git deposuna yansıdıktan sonra, bu değişiklikler otomatik olarak Kubernetes cluster'ımıza uygulanır.

Google Cloud'da Kubernetes Engine'de oluşturduğum cluster'a şu adımları uygulayarak ArgoCD kurulumunu gerçekleştirdim.
- `kubectl create namespace argocd`
- `kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml`
- `kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'`
- `kubectl get svc -n argocd`
- `kubectl get pods -n argocd -l app.kubernetes.io/name=argocd-server -o jsonpath="{.items[0].metadata.name}"`

# Prometheus & Grafana 

![image](https://github.com/user-attachments/assets/06b3c194-db23-4302-baa0-8db6b648b647)
![image](https://github.com/user-attachments/assets/786ad23d-13c8-43cc-8066-4e96a316a841)
Projemizde, Prometheus ve Grafana'yı sistemin performansını ve sağlığını izlemek için kullanıyoruz. Prometheus, Kubernetes ortamındaki metrikleri toplar ve analiz ederken, Grafana bu verileri görselleştirerek kullanıcıların sistem durumunu kolayca izlemesini sağlar. Bu kombinasyon, hızlı teşhis ve sorun çözme süreçleri için kritik öneme sahiptir.

# EFK

![image](https://github.com/user-attachments/assets/470cbb04-25d7-4291-a14c-4fafcad929ad)

EFK, Elasticsearch, Filebeat ve Kibana bileşenlerinden oluşan bir log yönetimi ve analiz çözümüdür. Bu stack, sistem ve uygulama loglarını toplamak, analiz etmek ve görselleştirmek için yaygın olarak kullanılır. Projemizde, EFK stack'ını sistem ve uygulama loglarını toplamak, analiz etmek ve görselleştirmek için kullanıyoruz. Filebeat, çeşitli kaynaklardan log verilerini toplar ve Elasticsearch'e gönderir. Elasticsearch, bu verileri depolar ve analiz ederken, Kibana bu verileri görselleştirir ve kullanıcı dostu bir arayüzde sunar. Bu yapı, log verilerini etkili bir şekilde izlememizi ve sorunları hızlı bir şekilde teşhis etmemizi sağlar.


# Velero

Velero bir arayüze sahip değil. Kubernetes cluster'ları için yedekleme (backup), geri yükleme (restore) ve veri taşıma (disaster recovery) işlemlerini yönetmek amacıyla kullanılan açık kaynaklı bir araçtır. Kubernetes ortamlarında veri kaybını önlemek ve veri bütünlüğünü sağlamak için önemli bir bileşendir.Projemizde Velero, Kubernetes cluster'ımızın güvenliği ve sürekliliğini sağlamak için kullanılır. Özellikle veri kaybını önlemek ve kritik uygulamaların yedekleme ve geri yükleme işlemlerini yönetmek amacıyla Velero'yu entegre ettik. Yedekleme işlemleri, Google Cloud'da oluşturduğumuz bir GCS bucket'a kaydedilir ve ihtiyaç duyulması halinde bu yedeklerden geri yükleme işlemleri yapılabilir.



