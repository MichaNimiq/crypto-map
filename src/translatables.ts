const messages = {
  de: {
    placeholders: {
      "search-places": "In Crypto Map suchen...",
      "find-anywhere": "Nach Ort suchen",
      "describe-issue": "Schreiben Sie Ihr Problem hier...",
    },
    labels: {
      "button-filter": "Filter",
      "button-add-establishment": "Crypto-Establishment hinzufügen",
      "button-show-list": "Liste anzeigen",
      "select-crypto": "Cryptowährungen",
      "select-establishment": "Art der Establishment",
      "select-crypto-button": "Cryptowährung wählen",
      "select-establishment-button": "Establishment wählen",
      "pickup-stores": "Pickups",
      "add-establishment-button": "Ort übermitteln",
      "find-place": "Establishment finden",
      "submit-place": "Establishment absenden",
      "cancel": "Abbrechen",
      "select-issue": "Problem wählen",
      "describe-issue": "Beschreibe das Problem",
      "report-issue": "Problem melden",
      "visit": "Besuche",
      "on-google-maps": "auf Google Maps",
    },
    infoWindows: {
      cryptomap: {
        title: "Crypto Map",
        text: "Diese Karte wird Ihnen von Nimiq zur Verfügung gestellt. Es werden nur durch Google verifizierte Standorte hinzugefügt.",
        url: "https://www.nimiq.com",
        urlText: "Gehe zu Nimiq"
      },
      addEstablishment: {
        title: "Einen Ort zur Cyptomap hinzufügen",
        text: "Du kannst einen beliebigen Ort, der sich im Google-Places-Verzeichnis befindet, hinzufügen.",
        url: "https://www.google.de/business/",
        urlText: "Erstelle ein Google-Business-Profil"
      },
      reportIssue: {
        title: "Ein Problem mit einem Establishment melden",
      },
    },
    // TODO: not finalised list, yet
    selectEntries: {
      "cur-btc": "Bitcoin",
      "cur-nim": "nimiq",
      "cur-ltc": "Litecoin",
      "cur-dash": "Dash",
      "cur-xlm": "Stella Lumens",
      "cur-eth": "Ethereum",
      "cur-xrp": "Ripple",
      "type-electronics": "Computer & Elektronik",
      "type-entertainment": "Unterhaltung",
      "type-food": "Essen & Trinken",
      "type-restaurant": "Restaurant & Bar",
      "type-health": "Gesundheit & Beauty",
      "type-leisure": "Freizeit",
      "type-home_goods_store": "Haushaltswaren",
      "type-locksmith": "Handwerk",
      "type-store": "Geschäft",
      "type-spa": "Gesundheit & Beauty",
      "type-car_repair": "Werkstadt",
      "type-car_dealer": "Händler",
      "type-lodging": "Hotel & Unterkunft",
      issue: {
        'desc': "Beschreibung nicht korrekt",
        'currency': "Währungen stimmen nicht überein",
        'establishment': "Standort ist falsch gesetzt",
        'gone': "Geschäft existiert nicht",
      }
    }
  },
  en: {
    placeholders: {
      "search-places": "Search crypto map...",
      "find-anywhere": "Anywhere / Establishment",
      "describe-issue": "Write your problem here ..",
    },
    labels: {
      "button-filter": "Filters",
      "button-add-establishment": "Add crypto establishment",
      "button-show-list": "Show List",
      "select-crypto": "Select Cryptocurrencies",
      "select-establishment": "Type of establishment",
      "select-crypto-button": "Select Cryptocurrencies",
      "select-establishment-button": "Select establishment",
      "pickup-stores": "Pickups",
      "add-establishment-button": "Send place",
      "find-place": "Find place",
      "submit-place": "Submit place",
      "cancel": "Cancel",
      "select-issue": "Select issue",
      "describe-issue": "Describe the issue",
      "report-issue": "Report issue",
      "visit": "Open",
      "on-google-maps": "on Google Maps",
    },
    infoWindows: {
      cryptomap: {
        title: "Crypto Map",
        text: "This app is brought to you by Nimiq, only places that are verified by Google are accepted for this map.",
        url: "https://www.nimiq.com",
        urlText: "Go to Nimiq"
      },
      addEstablishment: {
        title: "Add a place to the Crypto Map",
        text: "You can add any place that has a Google Business Profile.",
        url: "https://www.google.com/business/",
        urlText: "Create Googe Business profile"
      },
      reportIssue: {
        title: "Report an issue with a place",
      },
    },
    // TODO: not finalised list, yet
    selectEntries: {
      "cur-btc": "Bitcoin",
      "cur-nim": "nimiq",
      "cur-ltc": "Litecoin",
      "cur-dash": "Dash",
      "cur-xlm": "Stella Lumens",
      "cur-eth": "Ethereum",
      "cur-xrp": "Ripple",
      "type-electronics": "Computer & Elektronics",
      "type-entertainment": "Entertainment",
      "type-food": "Eat & Drink",
      "type-restaurant": "Restaurant & Bar",
      "type-health": "Health & Beauty",
      "type-leisure": "Leisure",
      "type-home_goods_store": "Home Goods",
      "type-locksmith": "Craftmanship",
      "type-store": "Store",
      "type-spa": "Health & Beauty",
      "type-car_repair": "Repair",
      "type-car_dealer": "Dealer",
      "type-lodging": "Hotel & Unterkunft",
      issue: {
        'gone': "Establishment closed / does not exist",
        'missing-currency': "Currency missing",
        'missing-not-accepted': "Currency not accepted",
        'not-crypto': "Establishment doesn't accept crypto",
        'other': "Other",
      }
    }
  },
};

export default messages;
