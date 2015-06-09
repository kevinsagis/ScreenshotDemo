define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/_base/array",
  "esri/tasks/query",
  "esri/tasks/QueryTask",
  "./FeatureLayerQueryResult"
], function(
  declare, lang, array, Query, QueryTask, FeatureLayerQueryResult
) {

  var FeatureLayerQueryStore = declare(null, {

    queryUrl: "",
    idProperty: "id",
    data: null,
    _entityData: null,

    constructor: function(options) {
      declare.safeMixin(this, options);
      this.data = [];
      this._entityData = [];

      this.layer = options.layer;

      // null for server side paging
      this.objectIds = options.objectIds;

      // required for server side paging
      this.where = options.where;
      this.orderByFields = options.orderByFields;

      this.totalCount = options.totalCount;
      this.batchCount = options.batchCount || 25;
      this.idProperty = this.layer.objectIdField;

      if (this.layer && this.layer.url) {
        this.queryTask = new QueryTask(this.layer.url);
      }
    }, // End constructor

    get: function(id) {
      return this.data[id];
    },
    getIdentity: function(object) {
      return object[this.idProperty];
    },

    query: function(query, options) {
      var queryObj = new Query();
      var start = (options && options.start) || 0;
      var count = /*options.count ||*/ this.batchCount;

      if (this.objectIds) {
        var filterIds = null;
        if (typeof query === 'function') {
          filterIds = array.filter(this.objectIds, lang.hitch(this, function(item) {
            return query(item);
          }));
        } else {
          filterIds = this.objectIds;
        }
        if (filterIds.length >= (start + this.batchCount)) {
          queryObj.objectIds = filterIds.slice(start, start + count);
        } else {
          queryObj.objectIds = filterIds.slice(start);
        }
      } else {
        // server supports paging
        queryObj.start = start;
        queryObj.num = count; // doesn't matter if there are not <num> features left
        queryObj.where = this.where;
        queryObj.orderByFields = this.orderByFields;
      }

      queryObj.returnGeometry = false;
      queryObj.outFields = ["*"];
      var totalCount = this.totalCount;

      var results = null;
      // never request data if objectIds and where clause is invalid
      var invalidIds = !(queryObj.objectIds && queryObj.objectIds.length > 0);
      var invalidWhereStr = !queryObj.where;
      if (invalidIds && invalidWhereStr) {
        return new FeatureLayerQueryResult([]);
      }

      if (this.queryTask) {
        results = this.queryTask.execute(queryObj);
      } else {
        results = this.layer.queryFeatures(queryObj);
      }

      results.total = results.then(lang.hitch(this, function(result) {
        var i = 0;
        // var objectIdFieldName = result.objectIdFieldName;
        var objectIdFieldName = this.layer.objectIdField;

        if (this.objectIds) {
          // sort the resulting features to the order of the objectIds sent in
          if (!objectIdFieldName) {
            for (i = 0; i < result.fields.length; i++) {
              if (result.fields[i].type === "esriFieldTypeOID") {
                objectIdFieldName = result.fields[i].name;
                break;
              }
            }
          }

          var lookup = {};
          for (i = 0; i < result.features.length; i++) {
            lookup[result.features[i].attributes[objectIdFieldName]] = result.features[i];
          }

          result.features = array.map(queryObj.objectIds, function(objectId) {
            return lookup[objectId];
          });
        }

        // modify the JSON response to an array of objects containing the info for grid rows
        for (i = 0; i < result.features.length; i++) {
          if (result.features[i]) {
            result.features[i] = result.features[i].attributes;
            this.data[result.features[i][objectIdFieldName]] = result.features[i];
            this._entityData.push(result.features[i]);
          }
        }

        result = result.features;

        return totalCount;

      }), function() {
        console.log("FeatureLayerQueryStore queryFeatures failed.");
        return 0;
      });

      return new FeatureLayerQueryResult(results);
    }

  });
  return FeatureLayerQueryStore;
});