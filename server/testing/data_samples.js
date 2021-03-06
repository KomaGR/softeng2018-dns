exports.data = {
    "products": [
      {"name":  "Προϊόν 1", "description":  "Περιγραφή προϊόντος 1", "category":  "Κατηγορία Πρώτη", "tags": ["Υπολογιστές"]},
      {"name":  "Προϊόν 2", "description":  "Περιγραφή προϊόντος 2", "category":  "Κατηγορία Δεύτερη", "tags": ["Μουσική"]},
      {"name":  "Προϊόν 3", "description":  "Περιγραφή προϊόντος 3", "category":  "Κατηγορία Πρώτη", "tags": ["Μουσική", "Διασκέδαση"]}
    ],
  
    "products_queries": [
      {
        "start": 0,
        "count": 10,
        "status": "ACTIVE",
        "sort": "name|DESC",
        "results": ["Προϊόν 3", "Προϊόν 2", "Προϊόν 1"]
      }
    ],
  
    "shops": [
      {"name":  "Κατάστημα Χαλκίδας", "address": "Κριεζώτου 14, T.K. 34100, Χαλκίδα", "lat": 38.46361, "lng": 23.59944,
        "tags": ["Μουσική", "Υπολογιστές"]
      },
      {"name":  "Κατάστημα Ψυχικού", "address": "Διονυσίου Σολωμού 3, T.K. 15451, Ψυχικό", "lat": 38.01324, "lng": 23.77223,
        "tags": ["Μουσική", "Υπολογιστές", "Βιβλία"]
      },
      {"name":  "Κατάστημα Αγίας Παρασκευής", "address": "Λεωφόρος Μεσογείων 402, T.K. 15342, Αγία Παρασκευή", "lat": 38.01667, "lng": 23.83333,
        "tags": ["Κινητά", "Υπολογιστές", "Βιβλία"]
      }
    ],
  
    "shops_queries": [
      {
        "start": 0,
        "count": 10,
        "status": "ACTIVE",
        "sort": "name|DESC",
        "results": ["Κατάστημα Ψυχικού", "Κατάστημα Χαλκίδας", "Κατάστημα Αγίας Παρασκευής"]
      }
    ],
  
    "prices": [
      {"price": 10.00, "dateFrom":  "2019-02-23", "dateTo":  "2019-02-24", "shopIndex": 0, "productIndex": 0},
      {"price": 11.20, "dateFrom":  "2019-02-23", "dateTo":  "2019-02-24", "shopIndex": 1, "productIndex": 0},
      {"price": 10.54, "dateFrom":  "2019-02-23", "dateTo":  "2019-02-24", "shopIndex": 2, "productIndex": 0},
      {"price": 32.99, "dateFrom":  "2019-02-23", "dateTo":  "2019-02-24", "shopIndex": 0, "productIndex": 1},
      {"price": 36.99, "dateFrom":  "2019-02-23", "dateTo":  "2019-02-24", "shopIndex": 1, "productIndex": 1},
      {"price": 37.99, "dateFrom":  "2019-02-23", "dateTo":  "2019-02-24", "shopIndex": 2, "productIndex": 1},
      {"price": 97.30, "dateFrom":  "2019-02-23", "dateTo":  "2019-02-24", "shopIndex": 0, "productIndex": 2},
      {"price": 92.90, "dateFrom":  "2019-02-23", "dateTo":  "2019-02-24", "shopIndex": 1, "productIndex": 2},
      {"price": 90.00, "dateFrom":  "2019-02-23", "dateTo":  "2019-02-24", "shopIndex": 2, "productIndex": 2}
    ],
  
    "prices_queries": [
      {
        "start": 0,
        "count": 10,
        "geoDist": null,
        "geoLng": null,
        "geoLat": null,
        "dateFrom": "2019-02-23",
        "dateTo": "2019-02-23",
        "shopIndexes": [0, 1, 2],
        "productIndexes": [0],
        "tags": null,
        "sort": ["price|ASC"],
        "results": {
          "start": 0,
          "count": 10,
          "total": 3,
          "prices": [
            {"price": 10.00, "date":  "2019-02-23", "shopIndex": 0, "productIndex":  0},
            {"price": 10.54, "date":  "2019-02-23", "shopIndex": 2, "productIndex":  0},
            {"price": 11.20, "date":  "2019-02-23", "shopIndex": 1, "productIndex":  0}
          ]
        }
      }
    ]
  };