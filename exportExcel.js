const { Client, Databases } = require("node-appwrite");
const XLSX = require("xlsx");

const clientLocal = new Client()
    .setEndpoint("http://localhost/v1")       // Appwrite endpoint
    .setProject("68e2df4f002bb47f72d7")            // Project ID
    .setKey("standard_3e97cda42c92db6e3267612a93b07b17d6a941cfa6f588d2cfa1a8b4a22b6cef7c0aea27586ea1c50899c184c95931844df1c26b85f57bb85d185b727884952cd141bbf57945cc14cbb7a6527d1593aa84044dd0a4d8ca5834cff44afd69825d95eb01fa8913791aab02b2e50150195281efb25663e08c669b4794aed2cdf6d7");                  // API Key (Database perms olan)

const databases = new Databases(clientLocal);
const databaseId = "68e3df8e003bab8945f5"; // Database ID
const collectionName = "Blogs"; // Export edilecek koleksiyon adını buraya yazın

async function exportToExcel() {
    try {
        console.log(`\nKoleksiyon listeleniyor: ${collectionName}...`);
        
        // Önce koleksiyonları listele ve istenen koleksiyonu bul
        const collections = await databases.listCollections(databaseId);
        const collection = collections.collections.find(col => 
            col.name.toLowerCase() === collectionName.toLowerCase()
        );

        if (!collection) {
            console.error(`\n❌ Koleksiyon "${collectionName}" bulunamadı.`);
            console.log("\nMevcut koleksiyonlar:");
            collections.collections.forEach(col => {
                console.log(`  - ${col.name} (ID: ${col.$id})`);
            });
            process.exit(1);
        }

        console.log(`✅ Koleksiyon bulundu: ${collection.name} (ID: ${collection.$id})`);
        console.log(`\nVeriler alınıyor...`);
        
        const res = await databases.listDocuments(databaseId, collection.$id);
        
        if (res.documents.length === 0) {
            console.log("Bu koleksiyonda veri bulunamadı.");
            return;
        }

        console.log(`${res.documents.length} adet döküman bulundu.`);
        console.log(`Excel dosyası oluşturuluyor...`);

        const data = res.documents.map(doc => ({ ...doc }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, collection.name);

        const filename = `./exports/${collection.name}-export.xlsx`;
        XLSX.writeFile(workbook, filename);
        console.log(`✅ Başarıyla export edildi: ${filename}`);
    } catch (error) {
        console.error(`❌ Hata:`, error.message);
        process.exit(1);
    }
}

exportToExcel();
