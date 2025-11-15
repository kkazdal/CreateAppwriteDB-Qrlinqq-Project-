const { Client, Databases, Permission, Role, ID, Query } = require("node-appwrite");

const clientLocal = new Client()
  .setEndpoint("http://localhost/v1")       // Appwrite endpoint
  .setProject("68e2df4f002bb47f72d7")            // Project ID
  .setKey("standard_3e97cda42c92db6e3267612a93b07b17d6a941cfa6f588d2cfa1a8b4a22b6cef7c0aea27586ea1c50899c184c95931844df1c26b85f57bb85d185b727884952cd141bbf57945cc14cbb7a6527d1593aa84044dd0a4d8ca5834cff44afd69825d95eb01fa8913791aab02b2e50150195281efb25663e08c669b4794aed2cdf6d7");                  // API Key (Database perms olan)

const clientProduction = new Client()
  .setEndpoint("https://appwrite.qrlinqq.io/v1")       // Appwrite endpoint
  .setProject("691755e2000be3a973b8")            // Project ID
  .setKey("standard_791162ef459ac68617f04b3f88f8ecf7c0c62f428f0b1330960b88b05ec058d35aa4d72f608d7577014f0d41590722a44b21845c690a04037de3a6a37c6d76b4af96e648f9918ba287844ad2db4fd5ed2f6979cd9dbfc39b824e0b33d444c898cd6d79214a839b479dda5155647cadf7e0fbf7636ac928c228d6dc4c236f34c0");                  // API Key (Database perms olan)

const databases = new Databases(clientLocal);

const databaseId = "68e3df8e003bab8945f5";

const collections = [
  {
    id: "QRStatusEnum",
    name: "QRStatusEnum",
    attributes: [
      { key: "statusKey", type: "string", size: 50, required: true },
      { key: "statusLabel", type: "string", size: 100, required: true },
      { key: "color", type: "string", size: 20, required: false },
      { key: "order", type: "integer", required: false },
    ],
    initialData: [
      { statusKey: "active", statusLabel: "Active", color: "green", order: 1 },
      { statusKey: "inactive", statusLabel: "Inactive", color: "gray", order: 2 },
    ],
  },
  {
    id: "QRCodes",
    name: "QRCodes",
    attributes: [
      { key: "userId", type: "string", size: 50, required: true },
      { key: "qrName", type: "string", size: 200, required: true },
      { key: "createdDate", type: "datetime", required: true },
      { key: "updatedDate", type: "datetime", required: true },
      { key: "qrCodeType", type: "string", size: 50, required: true },//menu,social,vcard,facebook,instagran,wifi
      { key: "status", type: "relationship", relationshipType: "manyToOne", relatedCollection: "QRStatusEnum", size: 1000, required: true },
    ],
  },
  {
    id: "ContactUs",
    name: "ContactUs",
    attributes: [
      { key: "userId", type: "string", size: 50, required: true },
      { key: "name", type: "string", size: 100, required: true },
      { key: "email", type: "string", size: 100, required: true },
      { key: "message", type: "string", size: 1000, required: true },
    ],
  },
  {
    id: "Facebook",
    name: "Facebook",
    attributes: [
      { key: "userId", type: "string", size: 50, required: true },
      { key: "qrName", type: "string", size: 200, required: true },
      { key: "qrCodeId", type: "relationship", relationshipType: "oneToOne", relatedCollection: "QRCodes", size: 1000, required: true },
      { key: "facebookUrl", type: "string", size: 1000, required: true },
      { key: "title", type: "string", size: 200, required: true },
      { key: "description", type: "string", size: 350, required: false },
      { key: "image", type: "string", size: 9999, required: false },
      { key: "selectedFont", type: "string", size: 100, required: true },
      { key: "backgroundColor", type: "string", size: 20, required: true },
      { key: "logoColor", type: "string", size: 20, required: true },
      { key: "buttonColor", type: "string", size: 20, required: true },
      { key: "buttonText", type: "string", size: 100, required: true },
    ],
  },
  {
    id: "Profiles",
    name: "Profiles",
    attributes: [
      { key: "userId", type: "string", size: 50, required: true },
      { key: "firstName", type: "string", size: 100, required: true },
      { key: "lastName", type: "string", size: 100, required: true },
      { key: "image", type: "string", size: 9999, required: false },
      { key: "qrCodeId", type: "relationship", relationshipType: "oneToOne", relatedCollection: "QRCodes", size: 1000, required: true },
    ],
  },
  {
    id: "SocialLinks",
    name: "SocialLinks",
    attributes: [
      { key: "userId", type: "string", size: 50, required: true },
      { key: "platform", type: "string", size: 50, required: true },
      { key: "qrCodeId", type: "relationship", relationshipType: "manyToOne", relatedCollection: "QRCodes", size: 1000, required: true },
      { key: "url", type: "string", size: 1000, required: false },
      { key: "icon", type: "string", size: 500, required: false },
    ],
  },
  {
    id: "Wifi",
    name: "Wifi",
    attributes: [
      { key: "userId", type: "string", size: 50, required: true },
      { key: "qrCodeId", type: "relationship", relationshipType: "oneToOne", relatedCollection: "QRCodes", size: 1000, required: true },
      { key: "ssid", type: "string", size: 100, required: true },
      { key: "password", type: "string", size: 100, required: true },
      { key: "security", type: "string", size: 50, required: true },
    ],
  },
  {
    id: "SocialMedia",
    name: "SocialMedia",
    attributes: [
      { key: "userId", type: "string", size: 50, required: true },
      { key: "title", type: "string", size: 50, required: true },
      { key: "description", type: "string", size: 350, required: false },
      { key: "selectedFont", type: "string", size: 100, required: true },
      { key: "text", type: "string", size: 100, required: true },
      { key: "backgroundColor", type: "string", size: 20, required: true },
      { key: "titleTextColor", type: "string", size: 20, required: true },
      { key: "qrCodeId", type: "relationship", relationshipType: "manyToOne", relatedCollection: "QRCodes", size: 1000, required: true },
    ],
  },
  {
    id: "Phones",
    name: "Phones",
    attributes: [
      { key: "userId", type: "string", size: 50, required: true },
      { key: "label", type: "string", size: 50, required: false },
      { key: "number", type: "string", size: 50, required: false },
      { key: "qrCodeId", type: "relationship", relationshipType: "manyToOne", relatedCollection: "QRCodes", size: 1000, required: true },
    ],
  },
  {
    id: "Instagram",
    name: "Instagram",
    attributes: [
      { key: "userId", type: "string", size: 50, required: true },
      { key: "instagramUsername", type: "string", size: 50, required: false },
      { key: "qrCodeId", type: "relationship", relationshipType: "manyToOne", relatedCollection: "QRCodes", size: 1000, required: true },
    ],
  },
  {
    id: "Emails",
    name: "Emails",
    attributes: [
      { key: "userId", type: "string", size: 50, required: true },
      { key: "label", type: "string", size: 50, required: false },
      { key: "email", type: "string", size: 100, required: false },
      { key: "qrCodeId", type: "relationship", relationshipType: "manyToOne", relatedCollection: "QRCodes", size: 1000, required: true },
    ],
  },
  {
    id: "Websites",
    name: "Websites",
    attributes: [
      { key: "userId", type: "string", size: 50, required: true },
      { key: "label", type: "string", size: 50, required: false },
      { key: "url", type: "string", size: 1000, required: false },
      { key: "qrCodeId", type: "relationship", relationshipType: "manyToOne", relatedCollection: "QRCodes", size: 1000, required: true },
    ],
  },
  {
    id: "LocationData",
    name: "LocationData",
    attributes: [
      { key: "userId", type: "string", size: 50, required: true },
      { key: "streetNumber", type: "string", size: 50, required: false },
      { key: "street", type: "string", size: 100, required: false },
      { key: "number", type: "string", size: 50, required: false },
      { key: "postalCode", type: "string", size: 20, required: false },
      { key: "city", type: "string", size: 50, required: false },
      { key: "state", type: "string", size: 50, required: false },
      { key: "country", type: "string", size: 50, required: false },
      { key: "qrCodeId", type: "relationship", relationshipType: "oneToOne", relatedCollection: "QRCodes", size: 1000, required: true },
    ],
  },
  {
    id: "CompanyData",
    name: "CompanyData",
    attributes: [
      { key: "userId", type: "string", size: 50, required: true },
      { key: "company", type: "string", size: 100, required: false },
      { key: "position", type: "string", size: 100, required: false },
      { key: "summary", type: "string", size: 300, required: false },
      { key: "qrCodeId", type: "relationship", relationshipType: "oneToOne", relatedCollection: "QRCodes", size: 1000, required: true },
    ],
  },
  {
    id: "ColorTheme",
    name: "ColorTheme",
    attributes: [
      { key: "userId", type: "string", size: 50, required: true },
      { key: "selectedTheme", type: "string", size: 50, required: true },
      { key: "primaryColor", type: "string", size: 20, required: true },
      { key: "secondaryColor", type: "string", size: 20, required: true },
      { key: "selectedFont", type: "string", size: 100, required: true },
      { key: "qrCodeId", type: "relationship", relationshipType: "oneToOne", relatedCollection: "QRCodes", size: 1000, required: true },
    ],
  },
  {
    id: "QrCodeStyles",
    name: "QrCodeStyles",
    attributes: [
      { key: "userId", type: "string", size: 50, required: true },
      { key: "selectedQrCodeStyleId", type: "string", size: 50, required: true },
      { key: "selectedSize", type: "string", size: 20, required: true },
      { key: "selectedFrameColor", type: "string", size: 20, required: true },
      { key: "selectedQrColor", type: "string", size: 20, required: true },
      { key: "selectedQrBgColor", type: "string", size: 20, required: true },
      { key: "qrText", type: "string", size: 20, required: true },
      { key: "qrCodeId", type: "relationship", relationshipType: "oneToOne", relatedCollection: "QRCodes", size: 1000, required: true },
    ],
  },
  {
    id: "Restaurant",
    name: "Restaurant",
    attributes: [
      { key: "userId", type: "string", size: 50, required: true },
      { key: "restaurantName", type: "string", size: 200, required: true },
      { key: "description", type: "string", size: 2000, required: false },
      { key: "restaurantImage", type: "string", size: 1000, required: false },
      { key: "restaurantImageFileId", type: "string", size: 100, required: false },
      { key: "selectedFont", type: "string", size: 100, required: true },
      { key: "mainColor", type: "string", size: 20, required: true },
      { key: "qrName", type: "string", size: 200, required: true },
      { key: "qrCodeId", type: "relationship", relationshipType: "oneToOne", relatedCollection: "QRCodes", size: 1000, required: true },
    ],
  },
  {
    id: "RestaurantCategories",
    name: "RestaurantCategories",
    attributes: [
      { key: "userId", type: "string", size: 50, required: true },
      { key: "restaurantId", type: "relationship", relationshipType: "manyToOne", relatedCollection: "Restaurant", size: 1000, required: true },
      { key: "name", type: "string", size: 200, required: true },
      { key: "description", type: "string", size: 1000, required: false },
    ],
  },
  {
    id: "RestaurantProducts",
    name: "RestaurantProducts",
    attributes: [
      { key: "userId", type: "string", size: 50, required: true },
      { key: "categoryId", type: "relationship", relationshipType: "manyToOne", relatedCollection: "RestaurantCategories", size: 1000, required: true },
      { key: "name", type: "string", size: 200, required: true },
      { key: "price", type: "string", size: 50, required: true },
      { key: "description", type: "string", size: 1000, required: false },
      { key: "imageUrl", type: "string", size: 1000, required: false },
      { key: "imageFileId", type: "string", size: 100, required: false },
    ],
  },
  {
    id: "RestaurantHours",
    name: "RestaurantHours",
    attributes: [
      { key: "userId", type: "string", size: 50, required: true },
      { key: "restaurantId", type: "relationship", relationshipType: "manyToOne", relatedCollection: "Restaurant", size: 1000, required: true },
      { key: "day", type: "string", size: 20, required: true },
      { key: "openHour", type: "string", size: 10, required: true },
      { key: "closeHour", type: "string", size: 10, required: true },
    ],
  },
  {
    id: "RestaurantPhones",
    name: "RestaurantPhones",
    attributes: [
      { key: "userId", type: "string", size: 50, required: true },
      { key: "restaurantId", type: "relationship", relationshipType: "manyToOne", relatedCollection: "Restaurant", size: 1000, required: true },
      { key: "label", type: "string", size: 50, required: false },
      { key: "number", type: "string", size: 50, required: true },
    ],
  },
  {
    id: "RestaurantEmails",
    name: "RestaurantEmails",
    attributes: [
      { key: "userId", type: "string", size: 50, required: true },
      { key: "restaurantId", type: "relationship", relationshipType: "manyToOne", relatedCollection: "Restaurant", size: 1000, required: true },
      { key: "label", type: "string", size: 50, required: false },
      { key: "email", type: "string", size: 100, required: true },
    ],
  },
  {
    id: "RestaurantWebsites",
    name: "RestaurantWebsites",
    attributes: [
      { key: "userId", type: "string", size: 50, required: true },
      { key: "restaurantId", type: "relationship", relationshipType: "manyToOne", relatedCollection: "Restaurant", size: 1000, required: true },
      { key: "label", type: "string", size: 50, required: false },
      { key: "url", type: "string", size: 1000, required: true },
    ],
  },
  {
    id: "RestaurantSocialLinks",
    name: "RestaurantSocialLinks",
    attributes: [
      { key: "userId", type: "string", size: 50, required: true },
      { key: "restaurantId", type: "relationship", relationshipType: "manyToOne", relatedCollection: "Restaurant", size: 1000, required: true },
      { key: "platform", type: "string", size: 50, required: true },
      { key: "url", type: "string", size: 1000, required: true },
      { key: "icon", type: "string", size: 500, required: false },
    ],
  },

];

async function setup() {
  // Önce veritabanının var olup olmadığını kontrol et
  try {
    await databases.get(databaseId);
    console.log(`✅ Database found: ${databaseId}`);
  } catch (error) {
    console.log(`❌ Database not found: ${databaseId}`, error.message);
    console.log('Creating database...');
    try {
      await databases.create(databaseId, 'QR Link Database');
      console.log(`✅ Database created: ${databaseId}`);
    } catch (createError) {
      console.log(`❌ Failed to create database:`, createError.message);
      console.log('Please check your API key permissions');
      return;
    }
  }

  for (const col of collections) {
    try {
      await databases.createCollection(databaseId, col.id, col.name);
      console.log(`✅ Collection created: ${col.name}`);
    } catch (error) {
      console.log(`ℹ️ Collection already exists: ${col.name}`, error.message);
    }

    // Set collection-level permissions
    try {
      const permissions = [
        Permission.read(Role.any()), // Herkes okuyabilir
        Permission.create(Role.users()), // Kayıtlı tüm kullanıcılar oluşturabilir
        Permission.update(Role.users()), // Kayıtlı tüm kullanıcılar güncelleyebilir
        Permission.delete(Role.users()), // Kayıtlı tüm kullanıcılar silebilir
      ];
      await databases.updateCollection(databaseId, col.id, col.name, permissions);
      console.log(`   🔐 Permissions set for: ${col.name}`);
      console.log(`   📝 Note: Use userId field in queries to ensure users only access their own data`);
    } catch (permError) {
      console.log(`   ⚠️ Could not set permissions for: ${col.name}`, permError.message);
    }

    for (const attr of col.attributes) {
      try {
        if (attr.type === "string") {
          await databases.createStringAttribute(databaseId, col.id, attr.key, attr.size, attr.required);
        } else if (attr.type === "datetime") {
          await databases.createDatetimeAttribute(databaseId, col.id, attr.key, attr.required);
        } else if (attr.type === "boolean") {
          await databases.createBooleanAttribute(databaseId, col.id, attr.key, attr.required);
        } else if (attr.type === "integer") {
          await databases.createIntegerAttribute(databaseId, col.id, attr.key, attr.required);
        } else if (attr.type === "relationship") {
          await databases.createRelationshipAttribute(
            databaseId,
            col.id,
            attr.relatedCollection,
            attr.relationshipType,
            false, // twoWay
            attr.key // key
          );
        }
        console.log(`   ✅ Attribute created: ${attr.key}`);
      } catch (error) {
        console.log(`   ℹ️ Attribute already exists: ${attr.key}`, error.message);
      }
    }

    // Insert initial data if exists (for enum collections)
    if (col.initialData && Array.isArray(col.initialData)) {
      console.log(`   📝 Inserting initial data for: ${col.name}`);
      // Wait a bit for attributes to be ready
      await new Promise(resolve => setTimeout(resolve, 2000));

      for (const data of col.initialData) {
        try {
          // Check if document already exists by statusKey
          let existingDoc = null;
          if (col.id === "QRStatusEnum" && data.statusKey) {
            try {
              const docs = await databases.listDocuments(databaseId, col.id, [
                Query.equal("statusKey", data.statusKey)
              ]);
              if (docs.documents.length > 0) {
                existingDoc = docs.documents[0];
              }
            } catch (e) {
              // Collection might not be ready yet, continue
            }
          }

          if (existingDoc) {
            // Update existing document
            await databases.updateDocument(
              databaseId,
              col.id,
              existingDoc.$id,
              data,
              [
                Permission.read(Role.any()),
                Permission.update(Role.users()),
                Permission.delete(Role.users())
              ]
            );
            console.log(`   ✅ Updated document: ${data.statusKey || JSON.stringify(data)}`);
          } else {
            // Create new document
            await databases.createDocument(
              databaseId,
              col.id,
              ID.unique(),
              data,
              [
                Permission.read(Role.any()),
                Permission.update(Role.users()),
                Permission.delete(Role.users())
              ]
            );
            console.log(`   ✅ Created document: ${data.statusKey || JSON.stringify(data)}`);
          }
        } catch (error) {
          console.log(`   ⚠️ Could not insert data for ${col.name}:`, error.message);
        }
      }
    }
  }
}

setup().catch(console.error);

/*
DOCUMENT-LEVEL PERMISSIONS EXAMPLE:

Document oluştururken/güncellerken kullanıcıya özel izinler verin:

// QR Code oluştururken
await databases.createDocument(
  databaseId,
  'QRCodes',
  'unique()',
  {
    userId: currentUserId,
    qrName: 'My QR Code',
    createdDate: new Date(),
    updatedDate: new Date()
  },
  [
    Permission.read(Role.any()), // Herkes okuyabilir
    Permission.update(Role.user(currentUserId)), // Sadece o kullanıcı güncelleyebilir
    Permission.delete(Role.user(currentUserId))  // Sadece o kullanıcı silebilir
  ]
);

// Facebook document oluştururken
await databases.createDocument(
  databaseId,
  'Facebook',
  'unique()',
  {
    userId: currentUserId,
    qrName: 'My Facebook Page',
    qrCodeId: qrCodeDocumentId,
    facebookUrl: 'https://facebook.com/page',
    title: 'Page Title',
    description: 'Page Description',
    image: null,
    selectedFont: 'Arial',
    backgroundColor: '#ffffff',
    logoColor: '#000000',
    buttonColor: '#007bff'
  },
  [
    Permission.read(Role.any()), // Herkes okuyabilir
    Permission.update(Role.user(currentUserId)), // Sadece o kullanıcı güncelleyebilir
    Permission.delete(Role.user(currentUserId))  // Sadece o kullanıcı silebilir
  ]
);

Bu şekilde:
- Herkes tüm verileri okuyabilir (QR kod paylaşımı için)
- Sadece document sahibi kendi verilerini güncelleyebilir/silebilir
- Başka kullanıcılar birbirlerinin verilerini değiştiremez
- Collection-level'da update/delete yok, document-level'da özel izinler var

QUERY FILTER ÖRNEKLERİ:

// Kullanıcının kendi verilerini getir
const userDocuments = await databases.listDocuments(
  databaseId,
  'Facebook',
  [Query.equal('userId', currentUserId)]
);

// Kullanıcının kendi verisini güncelle
await databases.updateDocument(
  databaseId,
  'Facebook',
  documentId,
  { title: 'New Title' },
  [Query.equal('userId', currentUserId)] // Sadece kendi userId'si olan kayıtları güncelle
);

// Kullanıcının kendi verisini sil
await databases.deleteDocument(
  databaseId,
  'Facebook',
  documentId,
  [Query.equal('userId', currentUserId)] // Sadece kendi userId'si olan kayıtları sil
);
*/
