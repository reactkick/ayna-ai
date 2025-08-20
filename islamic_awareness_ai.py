# islamic_awareness_ai.py

from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import random

# Duygu durumlarına göre Kur'an Ayetleri ve Hadisler için örnek bir veri seti.
# Bu veri seti genişletilebilir ve bir veritabanından veya harici bir JSON dosyasından da okunabilir.
islamic_content_data = {
    "huzun": {
        "ayetler": [
            {
                "metin": "Allah'tan ümidinizi kesmeyin. Çünkü kâfirler topluluğundan başkası Allah'tan ümidini kesmez.",
                "referans": "Yusuf Suresi, 87. Ayet"
            },
            {
                "metin": "Gevşemeyin, hüzünlenmeyin. Eğer (gerçekten) iman etmiş kimseler iseniz, en üstün olan sizlersiniz.",
                "referans": "Âl-i İmrân Suresi, 139. Ayet"
            },
            {
                "metin": "Şüphesiz her zorlukla beraber bir kolaylık vardır.",
                "referans": "İnşirah Suresi, 5. Ayet"
            }
        ],
        "hadisler": [
            {
                "metin": "Müminin durumu ne hoştur! Her hâli kendisi için hayırlıdır. Bu durum yalnız mümine mahsustur. Başına sevinecek bir hâl geldiğinde şükreder, bu onun için hayır olur. Başına bir sıkıntı geldiğinde sabreder, bu da onun için hayır olur.",
                "referans": "Müslim, Zühd, 64"
            },
            {
                "metin": "Allah, kimin iyiliğini dilerse, onu sıkıntıya sokar.",
                "referans": "Buhârî, Merdâ, 1"
            }
        ]
    },
    "ofke": {
        "ayetler": [
            {
                "metin": "O takvâ sahipleri ki, bollukta da darlıkta da Allah için harcarlar; öfkelerini yutarlar ve insanları affederler. Allah, iyilik edenleri sever.",
                "referans": "Âl-i İmrân Suresi, 134. Ayet"
            }
        ],
        "hadisler": [
            {
                "metin": "Gerçek pehlivan, güreşte rakibini yenen değil, öfkelendiği zaman nefsine hâkim olandır.",
                "referans": "Buhârî, Edeb, 76; Müslim, Birr, 107"
            },
            {
                "metin": "Öfke şeytandandır, şeytan ise ateşten yaratılmıştır. Ateş su ile söndürülür. Öyleyse biriniz öfkelenince hemen gidip abdest alsın.",
                "referans": "Ebû Dâvûd, Edeb, 3"
            }
        ]
    },
    "mutluluk": {
        "ayetler": [
            {
                "metin": "De ki: 'Ancak Allah'ın lütfu ve rahmetiyle, işte bunlarla sevinsinler. Bu, onların biriktirdiklerinden daha hayırlıdır.'",
                "referans": "Yunus Suresi, 58. Ayet"
            },
            {
                "metin": "Eğer şükrederseniz, elbette size (nimetimi) artırırım.",
                "referans": "İbrahim Suresi, 7. Ayet"
            }
        ],
        "hadisler": [
            {
                "metin": "Sizin en hayırlınız, ahlakı en güzel olanınızdır.",
                "referans": "Buhârî, Edeb, 39"
            },
            {
                "metin": "Müslüman, dilinden ve elinden diğer Müslümanların güvende olduğu kimsedir.",
                "referans": "Buhârî, Îmân, 4"
            }
        ]
    },
    "umut": {
        "ayetler": [
            {
                "metin": "Ey kendilerinin aleyhine aşırı giden kullarım! Allah'ın rahmetinden ümidinizi kesmeyin.",
                "referans": "Zümer Suresi, 53. Ayet"
            }
        ],
        "hadisler": [
            {
                "metin": "Allah buyurur ki: 'Ben kulumun benim hakkımdaki zannı üzereyim.'",
                "referans": "Buhârî, Tevhîd, 15"
            }
        ]
    }
}


class IslamicAwarenessAI:
    def __init__(self):
        """Yapay zeka modülünü başlatır."""
        self.analyzer = SentimentIntensityAnalyzer()

    def analyze_emotion(self, text: str) -> str:
        """
        Verilen metnin duygu durumunu analiz eder.
        VADER'in 'compound' skoru, metnin genel duygu yoğunluğunu belirtir.
        - Pozitif: compound >= 0.05
        - Negatif: compound <= -0.05
        - Nötr: arada kalan değerler
        
        Bu örnekte basit bir sınıflandırma yapılmıştır.
        """
        score = self.analyzer.polarity_scores(text)['compound']
        if score >= 0.05:
            # Pozitif duygular için mutluluk veya umut seçilebilir.
            return random.choice(["mutluluk", "umut"])
        elif score <= -0.05:
            # Negatif duygular için hüzün veya öfke seçilebilir.
            # Daha detaylı analiz için metin içindeki anahtar kelimeler de taranabilir.
            if "kızgın" in text or "sinirli" in text or "öfke" in text:
                return "ofke"
            return "huzun"
        else:
            return "notr" # Nötr durumlar için genel bir içerik sunulabilir.

    def get_content_for_emotion(self, emotion: str) -> dict:
        """
        Belirtilen duygu durumuna göre rastgele bir ayet ve hadis seçer.
        """
        if emotion not in islamic_content_data:
            return {
                "ayet": {"metin": "Her durumda okunacak birçok ayet ve hadis bulunmaktadır.", "referans": ""},
                "hadis": {"metin": "Peygamber Efendimiz'in hayatı her anımız için bir rehberdir.", "referans": ""}
            }
            
        content = islamic_content_data[emotion]
        selected_ayet = random.choice(content["ayetler"])
        selected_hadis = random.choice(content["hadisler"])
        
        return {"ayet": selected_ayet, "hadis": selected_hadis}

    def generate_youtube_content(self, emotion: str, content: dict) -> dict:
        """
        Seçilen içeriklere göre YouTube video başlığı, açıklaması ve etiketleri oluşturur.
        """
        emotion_map_tr = {
            "huzun": "Hüzünlü",
            "ofke": "Öfkeli",
            "mutluluk": "Mutlu",
            "umut": "Umutlu"
        }
        
        title_templates = [
            f"Kendini {emotion_map_tr.get(emotion, '')} mi Hissediyorsun? Bu Ayet ve Hadis Sana Umut Olsun!",
            f"Zor Zamanlar İçin Manevi Bir Hatırlatma: {emotion_map_tr.get(emotion, '').capitalize()} Anında Ne Yapmalı?",
            f"Kalplere Şifa: {content['ayet']['referans']} ve Bir Hadis-i Şerif"
        ]
        
        title = random.choice(title_templates)
        
        description = f"""
Selamun Aleyküm,

Bu videoda, kendimizi '{emotion_map_tr.get(emotion, 'manevi olarak yoğun')}' hissettiğimiz anlarda bize yol gösterecek, kalbimize huzur verecek bir ayet ve bir hadis-i şerifi paylaşıyoruz. Unutmayın, her duygu Allah'tandır ve her durumda O'na sığınabiliriz.

🔹 Ayet-i Kerime:
"{content['ayet']['metin']}"
({content['ayet']['referans']})

🔹 Hadis-i Şerif:
"{content['hadis']['metin']}"
({content['hadis']['referans']})

Umarız bu hatırlatma, gününüze bir ışık olur. Kanalımıza abone olmayı ve bu videoyu sevdiklerinizle paylaşmayı unutmayın.

#İslam #Kuran #Hadis #Maneviyat #{emotion_map_tr.get(emotion, 'Dua').capitalize()} #Huzur #Farkındalık
        """
        
        tags = [
            "İslam", "Kuran", "Hadis", "Ayet", "Dua", "Manevi Rehberlik",
            "İslami Video", "Dini Video", "Yapay Zeka", "Ayna AI",
            emotion_map_tr.get(emotion, 'Farkındalık'),
            content['ayet']['referans'].split(' ')[0] # Sure adı
        ]

        return {
            "title": title.strip(),
            "description": description.strip(),
            "tags": ", ".join(tags)
        }

    def run(self, user_input: str):
        """
        Tüm süreci çalıştırır: Analiz et, içerik bul, YouTube metinlerini oluştur.
        """
        emotion = self.analyze_emotion(user_input)
        
        if emotion == "notr":
            print("Belirgin bir duygu tespit edilemedi. Lütfen daha açıklayıcı bir metin girin.")
            return

        print(f"Tespit Edilen Duygu Durumu: {emotion.capitalize()}")
        print("-" * 30)
        
        content = self.get_content_for_emotion(emotion)
        youtube_output = self.generate_youtube_content(emotion, content)
        
        print("✨ Otomatik Oluşturulan YouTube İçeriği ✨")
        print("\n▶️ BAŞLIK:")
        print(youtube_output['title'])
        
        print("\n▶️ AÇIKLAMA:")
        print(youtube_output['description'])
        
        print("\n▶️ ETİKETLER:")
        print(youtube_output['tags'])

# --- Örnek Kullanım ---
if __name__ == "__main__":
    ai = IslamicAwarenessAI()
    
    # Örnek 1: Hüzünlü bir durum
    print("--- ÖRNEK 1: HÜZÜN ---")
    user_text_1 = "Bugünlerde çok üzgünüm ve kendimi gerçekten yalnız hissediyorum. Hiçbir şey yolunda gitmiyor gibi."
    ai.run(user_text_1)
    
    print("\n" + "="*50 + "\n")
    
    # Örnek 2: Öfkeli bir durum
    print("--- ÖRNEK 2: ÖFKE ---")
    user_text_2 = "O kadar sinirliyim ki ne yapacağımı bilemiyorum. Haksızlığa uğradım ve çok öfkeliyim."
    ai.run(user_text_2)

    print("\n" + "="*50 + "\n")

    # Örnek 3: Mutlu bir durum
    print("--- ÖRNEK 3: MUTLULUK ---")
    user_text_3 = "Çok şükür, bugün harika haberler aldım ve çok mutluyum! Her şey için Allah'a hamdolsun."
    ai.run(user_text_3)
