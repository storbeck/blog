export const checksums = {
  "posts": "v3.5.0--iba7yOLHHVlPlIdxq-iskCEihNSqCX8A-OwYMLgguMA"
}
export const checksumsStructure = {
  "posts": "GP0tQNgxSPeGcOZIx0YOWgrafH49RDoag5x2YthFyLE"
}

export const tables = {
  "posts": "_content_posts",
  "info": "_content_info"
}

export default {
  "posts": {
    "type": "page",
    "fields": {
      "id": "string",
      "title": "string",
      "body": "json",
      "category": "string",
      "date": "string",
      "description": "string",
      "extension": "string",
      "legacyUrl": "string",
      "meta": "json",
      "navigation": "json",
      "path": "string",
      "seo": "json",
      "stem": "string"
    }
  },
  "info": {
    "type": "data",
    "fields": {}
  }
}