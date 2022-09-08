const messages = {
  de: {
    message: {
      hello: "hello world",
    },
    placeholders: {
      "search-places": "In Crypto Map suchen...",
      "find-anywhere": "Nach Ort suchen"
    },
    labels: {
      "button-filter": "Filter",
      "button-add-location": "Crypto-Location hinzufügen",
      "button-show-list": "Liste anzeigen",
      "select-crypto": "Cryptowährungen",
      "select-location": "Art der Location",
      "select-crypto-button": "Cryptowährung wählen",
      "select-location-button": "Location wählen",
      "pickup-stores": "Pickups",
      "add-location-button": "Ort übermitteln",
      "find-place": "Place finden"
    },
    // todo: API to get them automated?
    crypto: {
      btc: "Bitcoin",
      nim: "nimiq",
      ltc: "Litecoin",
      dash: "Dash",
      xlm: "Stella Lumens",
      eth: "Ethereum",
      xrp: "Ripple",
    },
    infoWindows: {
      cryptomap: {
        title: "Crypto Map",
        text: "Diese Karte wird Ihnen von Nimiq zur Verfügung gestellt. Es werden nur durch Google verifizierte Standorte hinzugefügt.",
        url: "https://www.nimiq.com",
        urlText: "Gehe zu Nimiq"
      },
      addLocation: {
        title: "Einen Ort zur Cyptomap hinzufügen",
        text: "Du kannst einen beliebigen Ort, der sich im Google-Places-Verzeichnis befindet, hinzufügen.",
        url: "https://www.google.de/business/",
        urlText: "Erstelle ein Google-Business-Profil"
      },
    },
    // TODO: not finalised list, yet
    selectEntries: {
      electronics: "Computer & Elektronik",
      entertainment: "Unterhaltung",
      food: "Essen & Trinken",
      restaurant: "Restaurant & Bar",
      health: "Gesundheit & Beauty",
      leisure: "Freizeit",
    }
  },
  en: {
    message: {
      hello: "こんにちは、世界",
    },
    placeholders: {
      "search-places": "Search crypto map...",
      "find-anywhere": "Anywhere / Place"
    },
    labels: {
      "button-filter": "Filters",
      "button-add-location": "Add crypto location",
      "button-show-list": "Show List",
      "select-crypto": "Cryptocurrencies",
      "select-location": "Type of location",
      "select-crypto-button": "Select Cryptocurrencies",
      "select-location-button": "Select location",
      "pickup-stores": "Pickups",
      "add-location-button": "Send place",
      "find-place": "Find place"
    },
    // todo: API to get them automated?
    crypto: {
      btc: "Bitcoin",
      nim: "nimiq",
      ltc: "Litecoin",
      dash: "Dash",
      xlm: "Stella Lumens",
      eth: "Ethereum",
      xrp: "Ripple",
    },
    infoWindows: {
      cryptomap: {
        title: "Crypto Map",
        text: "This app is brought to you by Nimiq, only places that are verified by Google are accepted for this map.",
        url: "https://www.nimiq.com",
        urlText: "Go to Nimiq"
      },
      addLocation: {
        title: "Add a place to the Crypto Map",
        text: "You can add any place that has a Google Business Profile.",
        url: "https://www.google.com/business/",
        urlText: "Create Googe Business profile"
      }
    },
    // TODO: not finalised list, yet
    selectEntries: {
      electronics: "Computer & Electronics",
      entertainment: "Entertainment",
      food: "Food & Drinks",
      restaurant: "Restaurant & Bar",
      health: "Health & Beauty",
      leisure: "Leisure Activities",
    }
  },
};

export default messages;
