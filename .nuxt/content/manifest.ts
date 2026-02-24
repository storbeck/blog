export const checksums = {
  "posts": "v3.5.0--yrdc3euc_9SYNOglT10Io6cSmohBUCVnExncTFbAuAM"
}
export const checksumsStructure = {
  "posts": "OVoxeMpSD2kAVvs1OomXKGVEXLypYmm1OhBB0ZUzWRE"
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
      "ogImage": "string",
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