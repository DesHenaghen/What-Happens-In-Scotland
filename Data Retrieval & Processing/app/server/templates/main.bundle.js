webpackJsonp(["main"],{

/***/ "../../../../../src/$$_lazy_route_resource lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "../../../../../src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "../../../../../src/app/_models/Colour.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Colour {
    static getColour(value) {
        if (value >= 80)
            return '#0a1b37';
        else if (value >= 70)
            return '#213f85';
        else if (value >= 60)
            return '#588bca';
        else if (value >= 50)
            return '#afb9f1';
        else if (value >= 40)
            return '#f3c8db';
        else if (value >= 30)
            return '#fe8a87';
        else if (value >= 20)
            return '#e33940';
        else
            return '#c20000';
    }
    static getColourDomain() {
        return [0, 20, 30, 40, 50, 60, 70, 80];
    }
    static getColourDomainLabels() {
        return ['<20', '20+', '30+', '40+', '50+', '60+', '70+', '>80'];
    }
    static getColours() {
        return ['#c20000', '#e33940', '#fe8a87', '#f3c8db', '#afb9f1', '#588bca', '#213f85', '#0a1b37'];
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Colour;



/***/ }),

/***/ "../../../../../src/app/_models/District.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class District {
    constructor() {
        this.id = '';
        this.name = '';
        this.values = [];
        this.average = 0;
        this.prettyAverage = 0;
        this.common_emote_words = [];
        this.total = 0;
        this.totals = [];
        this.last_tweets = [];
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = District;



/***/ }),

/***/ "../../../../../src/app/_models/MapModes.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapModes; });
var MapModes;
(function (MapModes) {
    MapModes[MapModes["Scotland"] = 0] = "Scotland";
    MapModes[MapModes["Glasgow"] = 1] = "Glasgow";
    MapModes[MapModes["Edinburgh"] = 2] = "Edinburgh";
})(MapModes || (MapModes = {}));


/***/ }),

/***/ "../../../../../src/app/_services/data-manager/data-manager.abstract.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__("../../../common/esm2015/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__tweet_tweet_service__ = __webpack_require__("../../../../../src/app/_services/tweet/tweet.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__ = __webpack_require__("../../../../rxjs/_esm2015/BehaviorSubject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_District__ = __webpack_require__("../../../../../src/app/_models/District.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_MapModes__ = __webpack_require__("../../../../../src/app/_models/MapModes.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_moment__ = __webpack_require__("../../../../moment/moment.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_moment__);






/**
 *
 */
class AbstractDataManager {
    constructor(injector) {
        // Fields
        this.district = new __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__["a" /* BehaviorSubject */](new __WEBPACK_IMPORTED_MODULE_3__models_District__["a" /* District */]());
        this.districts = {};
        this.districtsSubject = new __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__["a" /* BehaviorSubject */](undefined);
        this.latestTweet = new __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__["a" /* BehaviorSubject */](undefined);
        this.mapTopology = new __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__["a" /* BehaviorSubject */](undefined);
        this.loadedData = new __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__["a" /* BehaviorSubject */](false);
        this.targetDate = __WEBPACK_IMPORTED_MODULE_5_moment__();
        this.updateTweets = true;
        this._http = injector.get(__WEBPACK_IMPORTED_MODULE_0__angular_common_http__["a" /* HttpClient */]);
        this._tweet = injector.get(__WEBPACK_IMPORTED_MODULE_1__tweet_tweet_service__["a" /* TweetService */]);
    }
    getDistrict() {
        return this.district.asObservable();
    }
    getDistricts() {
        return this.districtsSubject.asObservable();
    }
    getLatestTweet() {
        return this.latestTweet.asObservable();
    }
    getMapTopology() {
        return this.mapTopology.asObservable();
    }
    getLoadedData() {
        return this.loadedData.asObservable();
    }
    getTweets() {
        return this._tweet.getTweets();
    }
    getMapBoundaryId() {
        return this.mapType + '-boundary';
    }
    updateLastTweet(tweet, id) {
        const new_scores = [];
        const new_words = [];
        // Highlight emotive words
        tweet.text = tweet.text.split(' ').map(word => this.highlightEmotiveWords(word, tweet, new_words, new_scores)).join(' ');
        tweet.text_sentiment_words = [...new_words, ...tweet.text_sentiment_words];
        tweet.text_sentiments = [...new_scores, ...tweet.text_sentiments];
        // If the tweet belongs to the whole map area, set the id accordingly
        id = (this.districtId === id) ? this.mapType + '-boundary' : id;
        tweet.id = id;
        const district = this.districts[id];
        const region = this.districts[this.mapType + '-boundary'];
        // If the id isn't equivalent to the region, update it
        if (region && district && region !== district) {
            this.districts[this.mapType + '-boundary'] = this.updateDistrict(region, tweet);
        }
        // If id matched one of the map disticts, update it
        if (district) {
            this.districts[id] = this.updateDistrict(district, tweet);
        }
        // If the id matched the district or one of the regions, update the values
        if (region || district) {
            this.districtsSubject.next(this.districts);
            this.latestTweet.next(tweet);
        }
    }
    highlightEmotiveWords(word, tweet, new_words, new_scores) {
        if (tweet.text_sentiment_words[0] && word.toLowerCase().startsWith(tweet.text_sentiment_words[0])) {
            new_words.push(tweet.text_sentiment_words.shift());
            const score = tweet.text_sentiments.shift();
            new_scores.push(score);
            if (score > 0) {
                word = '<span class="good_word">' + word + '</span>';
            }
            else if (score < 0) {
                word = '<span class="bad_word">' + word + '</span>';
            }
        }
        return word;
    }
    updateDistrict(district, tweet) {
        if (this.updateTweets && new Date(district.values[district.values.length - 1].x).toDateString() === new Date().toDateString()) {
            // Check if a new hour has started, in which case update all stats to be for this hour
            if (__WEBPACK_IMPORTED_MODULE_5_moment__(tweet.date).hour() !== __WEBPACK_IMPORTED_MODULE_5_moment__(district.values[district.values.length - 1].x).hour())
                this.addNewHourData();
            tweet.name = tweet.user.name;
            let sum = district.average * district.totals[district.totals.length - 1];
            sum = (!isNaN(sum)) ? sum + tweet.score : tweet.score;
            tweet.date = new Date().toISOString();
            district.total++;
            district.totals[district.totals.length - 1]++;
            district.average = sum / district.totals[district.totals.length - 1];
            if (district.values && district.values.length > 0 && district.values[district.values.length - 1])
                district.values[district.values.length - 1].y = district.average;
            district.prettyAverage = Math.round(district.average * 10) / 10;
            const nowDate = new Date();
            nowDate.setMinutes(nowDate.getMinutes() - 1);
            district.last_tweets = district.last_tweets.filter((x) => new Date(x.date) > nowDate);
            // Update most common words
            for (let i = 0; i < tweet.text_sentiment_words.length; i++) {
                const word = tweet.text_sentiment_words[i];
                // If the word exists in the object, add 1
                if (district.common_emote_words.hasOwnProperty(word)) {
                    district.common_emote_words[word].freq++;
                    // if the word has a sentiment weight add it to the object
                }
                else if (tweet.text_sentiments[i] !== 0 && word.length > 2) {
                    district.common_emote_words[word] = {
                        word: word,
                        freq: 1,
                        score: this.wordScoreToAreaScore(tweet.text_sentiments[i] + 4)
                    };
                }
            }
            district.last_tweets.unshift(tweet);
            if (this.mapMode === __WEBPACK_IMPORTED_MODULE_4__models_MapModes__["a" /* MapModes */].Scotland && district.id === this.districtId) {
                this._tweet.addTweet(tweet);
            }
        }
        return district;
    }
    addNewHourData() {
        if (this.districts) {
            const hourKey = __WEBPACK_IMPORTED_MODULE_5_moment__().minute(0).second(0).millisecond(0).valueOf();
            for (const district of Object.values(this.districts)) {
                district.totals.push(0);
                district.average = 50;
                district.prettyAverage = 50;
                district.values.push({ x: hourKey, y: 0 });
            }
        }
    }
    wordScoreToAreaScore(score) {
        return (score + 4) / 8 * 100;
    }
    /**
     * Loads the districts from a JSON file. Generates data for these districts and passes this data
     * to the child map component.
     */
    loadDistrictsData() {
        this.loadedData.next(false);
        d3.json('./assets/json/' + this.dataFile, (error, topology) => {
            if (error) {
                console.error(error);
            }
            else {
                const areaIds = [];
                const areaNames = {};
                // Extract data for each district
                topology.features.forEach((feature) => {
                    const id = feature.properties[this.topologyId];
                    areaNames[id] = feature.properties[this.topologyName];
                    areaIds.push(id);
                });
                // All of regions data
                areaIds.push(this.districtId);
                areaNames[this.districtId] = this.regionName;
                this.getDistrictsData(areaIds).subscribe(results => {
                    for (let i = 0; i < areaIds.length; i++) {
                        const id = areaIds[i];
                        const wardData = results[id];
                        const values = wardData.values;
                        const name = areaNames[id];
                        const average = (values.length > 0) ? values[values.length - 1].y : 0;
                        const prettyAverage = Math.round(average * 10) / 10;
                        const last_tweets = (wardData.last_tweet) ?
                            [wardData.last_tweet] :
                            [];
                        const districtId = (id === this.districtId) ? this.getMapBoundaryId() : id;
                        this.districts[districtId] = {
                            id,
                            name,
                            values,
                            average,
                            prettyAverage,
                            last_tweets,
                            total: wardData.total,
                            totals: wardData.totals
                        };
                    }
                }, err => {
                    console.error(err);
                }, () => {
                    this.fetchCommonWords(areaIds);
                    this.loadedData.next(true);
                    this.districtsSubject.next(this.districts);
                    this.mapTopology.next(topology);
                    this.setDistrict(this.mapType + '-boundary');
                    this.fetchDistrictTweets(this.targetDate, false);
                });
            }
        });
    }
    fetchCommonWords(ids, period = 3) {
        this.getCommonWords(ids, this.targetDate, period).subscribe(results => {
            for (let [key, value] of Object.entries(results)) {
                value = value.slice(0, 30);
                key = (key === 'region') ? this.getMapBoundaryId() : key;
                if (this.districts[key]) {
                    const values = {};
                    for (const v of value) {
                        const vs = v.split(', ');
                        const vObj = {
                            word: vs[0],
                            score: this.wordScoreToAreaScore(parseFloat(vs[1])),
                            freq: parseFloat(vs[2])
                        };
                        values[vObj.word] = vObj;
                    }
                    this.districts[key].common_emote_words = values;
                }
            }
            this.districtsSubject.next(this.districts);
            this.district.next(this.district.getValue());
        });
    }
    fetchDistrictTweets(date, append) {
        if (this.mapMode === __WEBPACK_IMPORTED_MODULE_4__models_MapModes__["a" /* MapModes */].Scotland) {
            this.getDistrictsTweets(date).subscribe(results => {
                // results.map(t => t.date = new Date(t.date));
                this._tweet.setTweets(results, date, append);
            });
        }
    }
    refreshAllDistrictsData(date, period) {
        this.targetDate = __WEBPACK_IMPORTED_MODULE_5_moment__(date);
        this.loadedData.next(false);
        const areaIds = [];
        const areaNames = {};
        for (const [key, value] of Object.entries(this.districts)) {
            if (key !== this.getMapBoundaryId()) {
                areaIds.push(key);
                areaNames[key] = value.name;
            }
        }
        areaIds.push(this.districtId);
        areaNames[this.districtId] = this.regionName;
        this.getDistrictsData(areaIds, date, period).subscribe(results => {
            for (let i = 0; i < areaIds.length; i++) {
                const id = areaIds[i];
                const wardData = results[id];
                const values = wardData.values;
                const name = areaNames[id];
                const average = (values.length > 0) ? values[values.length - 1].y : 0;
                const prettyAverage = Math.round(average * 10) / 10;
                const last_tweets = (wardData.last_tweet) ?
                    [wardData.last_tweet] :
                    [];
                const districtId = (id === this.districtId) ? this.getMapBoundaryId() : id;
                this.districts[districtId] = {
                    id,
                    name,
                    values,
                    average,
                    prettyAverage,
                    last_tweets,
                    total: wardData.total,
                    totals: wardData.totals
                };
            }
        }, err => {
            console.error(err);
        }, () => {
            this.fetchCommonWords(areaIds, period);
            this.loadedData.next(true);
            this.districtsSubject.next(this.districts);
            this.setDistrict(this.mapType + '-boundary');
            this.fetchDistrictTweets(this.targetDate, false);
        });
    }
    /**
     * Sets the district as selected. Called by the child components.
     * @param {string} area - id of the selected district
     */
    setDistrict(area) {
        this.district.next(this.districts[area]);
    }
    getDistrictsData(ids, date = new Date(), period = 3) {
        const dateString = __WEBPACK_IMPORTED_MODULE_5_moment__(date).format('YYYY-MM-DD HH');
        return this._http.get('/api/' + this.apiDataRoute, {
            params: { ids, region: 'true', date: dateString, period: '' + period }
        });
    }
    getCommonWords(ids, date = __WEBPACK_IMPORTED_MODULE_5_moment__(), period = 3) {
        const dateString = date.format('YYYY-MM-DD HH');
        const params = {
            ids,
            region: 'true',
            group: (this.districtId.includes('boundary')) ? 'area' : 'ward',
            date: dateString,
            period: '' + period
        };
        if (!this.districtId.includes('boundary'))
            params['region_id'] = this.districtId;
        return this._http.get('/api/common_words', { params });
    }
    getDistrictsTweets(date) {
        return this._http.get('/api/districts_tweets', {
            params: { date: date.format('YYYY-MM-DD HH') }
        });
    }
    setUpdateTweets(bool) {
        this.updateTweets = bool;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AbstractDataManager;



/***/ }),

/***/ "../../../../../src/app/_services/data-manager/data-manager.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DataManagerService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm2015/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__glasgow_data_manager_glasgow_data_manager_service__ = __webpack_require__("../../../../../src/app/_services/glasgow-data-manager/glasgow-data-manager.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scotland_data_manager_scotland_data_manager_service__ = __webpack_require__("../../../../../src/app/_services/scotland-data-manager/scotland-data-manager.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_MapModes__ = __webpack_require__("../../../../../src/app/_models/MapModes.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_BehaviorSubject__ = __webpack_require__("../../../../rxjs/_esm2015/BehaviorSubject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__edinburgh_data_manager_edinburgh_data_manager_service__ = __webpack_require__("../../../../../src/app/_services/edinburgh-data-manager/edinburgh-data-manager.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






let DataManagerService = class DataManagerService {
    constructor(_glasgowDataManager, _scotlandDataManager, _edinburghDataManager) {
        this._glasgowDataManager = _glasgowDataManager;
        this._scotlandDataManager = _scotlandDataManager;
        this._edinburghDataManager = _edinburghDataManager;
        this._dataManagerSubject = new __WEBPACK_IMPORTED_MODULE_4_rxjs_BehaviorSubject__["a" /* BehaviorSubject */](this._dataManager);
        this._dataManagers = {};
        this._dataManagers[__WEBPACK_IMPORTED_MODULE_3__models_MapModes__["a" /* MapModes */].Scotland] = _scotlandDataManager;
        this._dataManagers[__WEBPACK_IMPORTED_MODULE_3__models_MapModes__["a" /* MapModes */].Glasgow] = _glasgowDataManager;
        this._dataManagers[__WEBPACK_IMPORTED_MODULE_3__models_MapModes__["a" /* MapModes */].Edinburgh] = _edinburghDataManager;
        this._dataManager = this._dataManagers[__WEBPACK_IMPORTED_MODULE_3__models_MapModes__["a" /* MapModes */].Scotland];
        this._dataManagerSubject.next(this._dataManager);
    }
    get districtId() {
        return this._dataManager.districtId;
    }
    get mapMode() {
        return this._dataManager.mapMode;
    }
    /**
     * Sets the current MapMode(State)
     * @param {number} mode - Enum value of MapModes
     */
    selectDataManager(mode) {
        this._dataManager = this._dataManagers[mode];
        this._dataManagerSubject.next(this._dataManager);
    }
    getDistrict() {
        return this._dataManager.getDistrict();
    }
    getDistricts() {
        return this._dataManager.getDistricts();
    }
    getLatestTweet() {
        return this._dataManager.getLatestTweet();
    }
    getMapTopology() {
        return this._dataManager.getMapTopology();
    }
    getDataManager() {
        return this._dataManagerSubject.asObservable();
    }
    getLoadedData() {
        return this._dataManager.getLoadedData();
    }
    updateLastTweet(tweet, id) {
        this._dataManager.updateLastTweet(tweet, id);
    }
    loadDistrictsData() {
        this._dataManager.loadDistrictsData();
    }
    getTweets() {
        return this._dataManager.getTweets();
    }
    fetchDistrictTweets(date, append) {
        this._dataManager.fetchDistrictTweets(date, append);
    }
    highlightEmotiveWords(word, tweet, new_words, new_scores) {
        return this._dataManager.highlightEmotiveWords(word, tweet, new_words, new_scores);
    }
    refreshAllDistrictsData(date, period) {
        for (const i in this._dataManagers) {
            if (this._dataManagers.hasOwnProperty(i)) {
                this._dataManagers[i].refreshAllDistrictsData(date, period);
            }
        }
    }
    setDistrict(area) {
        this._dataManager.setDistrict(area);
    }
    getMapBoundaryId() {
        return this._dataManager.getMapBoundaryId();
    }
    setUpdateTweets(bool) {
        this._dataManager.setUpdateTweets(bool);
    }
};
DataManagerService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__glasgow_data_manager_glasgow_data_manager_service__["a" /* GlasgowDataManagerService */],
        __WEBPACK_IMPORTED_MODULE_2__scotland_data_manager_scotland_data_manager_service__["a" /* ScotlandDataManagerService */],
        __WEBPACK_IMPORTED_MODULE_5__edinburgh_data_manager_edinburgh_data_manager_service__["a" /* EdinburghDataManagerService */]])
], DataManagerService);



/***/ }),

/***/ "../../../../../src/app/_services/edinburgh-data-manager/edinburgh-data-manager.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EdinburghDataManagerService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm2015/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__data_manager_data_manager_abstract__ = __webpack_require__("../../../../../src/app/_services/data-manager/data-manager.abstract.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_MapModes__ = __webpack_require__("../../../../../src/app/_models/MapModes.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



let EdinburghDataManagerService = class EdinburghDataManagerService extends __WEBPACK_IMPORTED_MODULE_1__data_manager_data_manager_abstract__["a" /* AbstractDataManager */] {
    constructor(injector) {
        super(injector);
        this.dataFile = 'edinburgh-wards.json';
        this.topologyId = 'WD13CD';
        this.topologyName = 'WD13NM';
        this.mapType = 'edinburgh';
        this.regionName = 'Edinburgh';
        this.districtId = 'S12000036';
        this.mapMode = __WEBPACK_IMPORTED_MODULE_2__models_MapModes__["a" /* MapModes */].Edinburgh;
        this.allowRegionPulsing = true;
        this.apiDataRoute = 'all_scotland_ward_data';
        this.loadDistrictsData();
        this.listenOnSockets();
    }
    listenOnSockets() {
        this._tweet.getScotlandDistrictTweets().subscribe((msg) => this.updateLastTweet(msg, msg.ward));
        this._tweet.getScotlandWardTweets().subscribe((msg) => this.updateLastTweet(msg, msg.ward));
    }
};
EdinburghDataManagerService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injector"]])
], EdinburghDataManagerService);



/***/ }),

/***/ "../../../../../src/app/_services/glasgow-data-manager/glasgow-data-manager.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GlasgowDataManagerService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm2015/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__data_manager_data_manager_abstract__ = __webpack_require__("../../../../../src/app/_services/data-manager/data-manager.abstract.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_MapModes__ = __webpack_require__("../../../../../src/app/_models/MapModes.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



let GlasgowDataManagerService = class GlasgowDataManagerService extends __WEBPACK_IMPORTED_MODULE_1__data_manager_data_manager_abstract__["a" /* AbstractDataManager */] {
    constructor(injector) {
        super(injector);
        this.dataFile = 'glasgow-wards.json';
        this.topologyId = 'WD13CD';
        this.topologyName = 'WD13NM';
        this.mapType = 'glasgow';
        this.regionName = 'Glasgow';
        this.districtId = 'S12000046';
        this.mapMode = __WEBPACK_IMPORTED_MODULE_2__models_MapModes__["a" /* MapModes */].Glasgow;
        this.allowRegionPulsing = true;
        this.apiDataRoute = 'all_scotland_ward_data';
        this.loadDistrictsData();
        this.listenOnSockets();
    }
    listenOnSockets() {
        this._tweet.getScotlandDistrictTweets().subscribe((msg) => this.updateLastTweet(msg, msg.ward));
        this._tweet.getScotlandWardTweets().subscribe((msg) => this.updateLastTweet(msg, msg.ward));
    }
};
GlasgowDataManagerService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injector"]])
], GlasgowDataManagerService);



/***/ }),

/***/ "../../../../../src/app/_services/index.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tweet_tweet_service__ = __webpack_require__("../../../../../src/app/_services/tweet/tweet.service.ts");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "e", function() { return __WEBPACK_IMPORTED_MODULE_0__tweet_tweet_service__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__web_socket_web_socket_service__ = __webpack_require__("../../../../../src/app/_services/web-socket/web-socket.service.ts");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "f", function() { return __WEBPACK_IMPORTED_MODULE_1__web_socket_web_socket_service__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__glasgow_data_manager_glasgow_data_manager_service__ = __webpack_require__("../../../../../src/app/_services/glasgow-data-manager/glasgow-data-manager.service.ts");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_2__glasgow_data_manager_glasgow_data_manager_service__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__scotland_data_manager_scotland_data_manager_service__ = __webpack_require__("../../../../../src/app/_services/scotland-data-manager/scotland-data-manager.service.ts");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_3__scotland_data_manager_scotland_data_manager_service__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__edinburgh_data_manager_edinburgh_data_manager_service__ = __webpack_require__("../../../../../src/app/_services/edinburgh-data-manager/edinburgh-data-manager.service.ts");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_4__edinburgh_data_manager_edinburgh_data_manager_service__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__data_manager_data_manager_service__ = __webpack_require__("../../../../../src/app/_services/data-manager/data-manager.service.ts");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_5__data_manager_data_manager_service__["a"]; });








/***/ }),

/***/ "../../../../../src/app/_services/scotland-data-manager/scotland-data-manager.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ScotlandDataManagerService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm2015/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__data_manager_data_manager_abstract__ = __webpack_require__("../../../../../src/app/_services/data-manager/data-manager.abstract.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_MapModes__ = __webpack_require__("../../../../../src/app/_models/MapModes.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



let ScotlandDataManagerService = class ScotlandDataManagerService extends __WEBPACK_IMPORTED_MODULE_1__data_manager_data_manager_abstract__["a" /* AbstractDataManager */] {
    constructor(injector) {
        super(injector);
        this.dataFile = 'scotland-councils-simplified.json';
        this.topologyId = 'LAD13CD';
        this.topologyName = 'LAD13NM';
        this.mapType = 'scotland';
        this.regionName = 'Scotland';
        this.districtId = 'scotland-boundary';
        this.mapMode = __WEBPACK_IMPORTED_MODULE_2__models_MapModes__["a" /* MapModes */].Scotland;
        this.allowRegionPulsing = false;
        this.apiDataRoute = 'all_scotland_district_data';
        this.loadDistrictsData();
        this.listenOnSockets();
    }
    listenOnSockets() {
        this._tweet.getScotlandDistrictTweets().subscribe((msg) => this.updateLastTweet(msg, msg.ward));
    }
};
ScotlandDataManagerService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injector"]])
], ScotlandDataManagerService);



/***/ }),

/***/ "../../../../../src/app/_services/tweet/tweet.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TweetService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm2015/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__web_socket_web_socket_service__ = __webpack_require__("../../../../../src/app/_services/web-socket/web-socket.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__("../../../../rxjs/_esm2015/add/operator/map.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_BehaviorSubject__ = __webpack_require__("../../../../rxjs/_esm2015/BehaviorSubject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_moment__ = __webpack_require__("../../../../moment/moment.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_moment__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





let TweetService = class TweetService {
    // Our constructor calls our wsService connect method
    constructor(wsService) {
        this.wsService = wsService;
        this.tweets = {};
        this.tweetsObserver = new __WEBPACK_IMPORTED_MODULE_3_rxjs_BehaviorSubject__["a" /* BehaviorSubject */]({});
        this.scotland_ward_tweets = wsService
            .connect_scotland_wards()
            .map((response) => {
            return response;
        });
        this.scotland_district_tweets = wsService
            .connect_scotland_districts()
            .map((response) => {
            return response;
        });
    }
    /**
     * Returns an Observable of the dictionary of tweet arrays
     * @returns {Observable<{[p: string]: Tweet[]}>}
     */
    getTweets() {
        return this.tweetsObserver.asObservable();
    }
    getScotlandDistrictTweets() {
        return this.scotland_district_tweets;
    }
    getScotlandWardTweets() {
        return this.scotland_ward_tweets;
    }
    /**
     * Sets the whole tweet array for the specified day
     * @param {Tweet[]} tweets
     * @param date
     * @param {boolean} append
     */
    setTweets(tweets, date, append) {
        if (!append) {
            this.tweets = {};
        }
        this.tweets[date.format('YYYY-MM-DD')] = tweets;
        this.tweetsObserver.next(this.tweets);
    }
    /**
     * Adds a tweet to the tweet array for the specified day, if possible
     * @param {Tweet} tweet
     * @param {Date} date
     */
    addTweet(tweet, date = new Date()) {
        const mDate = __WEBPACK_IMPORTED_MODULE_4_moment__(date);
        if (this.tweets[mDate.format('YYYY-MM-DD')]) {
            this.tweets[mDate.format('YYYY-MM-DD')].push(tweet);
            this.tweetsObserver.next(this.tweets);
        }
    }
};
TweetService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__web_socket_web_socket_service__["a" /* WebSocketService */]])
], TweetService);



/***/ }),

/***/ "../../../../../src/app/_services/web-socket/web-socket.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WebSocketService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm2015/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_socket_io_client__ = __webpack_require__("../../../../socket.io-client/lib/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_socket_io_client___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_socket_io_client__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__("../../../../rxjs/_esm2015/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Subject__ = __webpack_require__("../../../../rxjs/_esm2015/Subject.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




let WebSocketService = class WebSocketService {
    constructor() {
        this.socket = __WEBPACK_IMPORTED_MODULE_1_socket_io_client__();
    }
    connect_scotland_wards() {
        const observable = new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */](ob => {
            this.socket.on('ward_geo_tweet', (data) => ob.next(data));
            return () => this.socket.disconnect();
        });
        const observer = {
            next: (data) => {
                this.socket.emit('message', JSON.stringify(data));
            },
        };
        return __WEBPACK_IMPORTED_MODULE_3_rxjs_Subject__["a" /* Subject */].create(observer, observable);
    }
    connect_scotland_districts() {
        const observable = new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */](ob => {
            this.socket.on('district_geo_tweet', (data) => ob.next(data));
            return () => this.socket.disconnect();
        });
        const observer = {
            next: (data) => {
                this.socket.emit('message', JSON.stringify(data));
            },
        };
        return __WEBPACK_IMPORTED_MODULE_3_rxjs_Subject__["a" /* Subject */].create(observer, observable);
    }
};
WebSocketService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [])
], WebSocketService);



/***/ }),

/***/ "../../../../../src/app/app.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".navbar {\r\n  background-color: #0009 !important;\r\n}\r\n\r\n.navbar .navbar-brand {\r\n  color: rgb(255,255,255);\r\n}\r\n\r\n.nav-link.disabled {\r\n  cursor: default;\r\n}\r\n\r\nfooter {\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n}\r\n\r\n.nav-link.feedback {\r\n  color: white !important;\r\n  background-color: cadetblue;\r\n  border-radius: 10px;\r\n  font-size: 18px;\r\n  font-weight: bold;\r\n  padding: 5px;\r\n  text-align: center;\r\n  margin-top: 5px;\r\n}\r\n\r\n#intro-box {\r\n  position: fixed;\r\n  width: 100%;\r\n  height: 100%;\r\n  top: 0;\r\n  left: 0;\r\n  z-index: 9999999999999999;\r\n  background-color: rgba(0, 0, 0, 0.66);\r\n}\r\n\r\n#intro-message {\r\n  text-align: center;\r\n  position: absolute;\r\n  top: 50%;\r\n  left: 50%;\r\n  width: 350px;\r\n  height: 500px;\r\n  margin-left: -175px;\r\n  margin-top: -250px;\r\n  overflow: auto;\r\n}\r\n\r\n@media (max-width: 508px) {\r\n  #intro-message {\r\n    width: 250px;\r\n    height: 400px;\r\n    margin-left: -125px;\r\n    margin-top: -200px;\r\n  }\r\n}\r\n\r\n#text-box {\r\n  background-color: aliceblue;\r\n  border-radius: 13px;\r\n  padding: 20px;\r\n}\r\n\r\n/* The slider itself */\r\n.slider {\r\n  -webkit-appearance: none;  /* Override default CSS styles */\r\n  -moz-appearance: none;\r\n       appearance: none;\r\n  width: 100%; /* Full-width */\r\n  height: 25px; /* Specified height */\r\n  background: #d3d3d3; /* Grey background */\r\n  outline: none; /* Remove outline */\r\n  opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */ /* 0.2 seconds transition on hover */\r\n  transition: opacity .2s;\r\n}\r\n\r\n/* Mouse-over effects */\r\n.slider:hover {\r\n  opacity: 1; /* Fully shown on mouse-over */\r\n}\r\n\r\n/* The slider handle (use webkit (Chrome, Opera, Safari, Edge) and moz (Firefox) to override default look) */\r\n.slider::-webkit-slider-thumb {\r\n  -webkit-appearance: none; /* Override default look */\r\n  appearance: none;\r\n  width: 25px; /* Set a specific slider handle width */\r\n  height: 25px; /* Slider handle height */\r\n  background: #4CAF50; /* Green background */\r\n  cursor: pointer; /* Cursor on hover */\r\n}\r\n\r\n.slider::-moz-range-thumb {\r\n  width: 25px; /* Set a specific slider handle width */\r\n  height: 25px; /* Slider handle height */\r\n  background: #4CAF50; /* Green background */\r\n  cursor: pointer; /* Cursor on hover */\r\n}\r\n\r\n#date-box .mat-select-value,\r\n#date-box .mat-select-placeholder,\r\n#date-box .mat-form-field-label,\r\n#date-box .mat-select-arrow {\r\n  color: white !important;\r\n}\r\n\r\n#date-box .mat-form-field-underline {\r\n  color: white !important;\r\n  background-color: white;\r\n}\r\n\r\n#date-box {\r\n  color: white;\r\n  margin: auto;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<nav class=\"navbar navbar-expand-lg navbar-toggleable-md navbar-light bg-light\">\r\n  <button class=\"navbar-toggler navbar-toggler-right\" type=\"button\" data-toggle=\"collapse\" data-target=\"#navbarSupportedContent\" aria-controls=\"navbarSupportedContent\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">\r\n    <span class=\"navbar-toggler-icon\"></span>\r\n  </button>\r\n  <div class=\"navbar-brand\" id=\"navbar-brand\">What Happens In Scotland</div>\r\n\r\n  <div class=\"collapse navbar-collapse\" id=\"navbarSupportedContent\">\r\n    <div id=\"date-box\">\r\n      Showing the\r\n      <mat-form-field style=\"width: 2rem; height: 1px;\">\r\n        <mat-select [(value)]=\"period\">\r\n          <mat-option *ngFor=\"let i of [1,2,3,4,5]\" [value]=\"i\">{{i}}</mat-option>\r\n        </mat-select>\r\n      </mat-form-field>\r\n      days up to\r\n      <mat-form-field style=\"width: 7rem; height: 1px;\">\r\n        <input [(ngModel)]=\"endDate\" matInput [min]=\"minDate\" [max]=\"maxDate\" [matDatepicker]=\"picker\" placeholder=\"Choose a date\">\r\n        <mat-datepicker-toggle matSuffix [for]=\"picker\"></mat-datepicker-toggle>\r\n        <mat-datepicker #picker></mat-datepicker>\r\n      </mat-form-field>\r\n      <button class=\"btn btn-primary\" (click)=\"submitDate()\">Refresh</button>\r\n      <button class=\"btn btn-secondary\" (click)=\"resetDate()\">Now</button>\r\n    </div>\r\n\r\n    <ul class=\"navbar-nav ml-auto\">\r\n      <li class=\"nav-item active\">\r\n        <a class=\"nav-link feedback\" href=\"https://strathsci.qualtrics.com/jfe/form/SV_9N7rhKFwmprJvDf\">Leave Feedback</a>\r\n      </li>\r\n    </ul>\r\n  </div>\r\n</nav>\r\n\r\n<div id=\"intro-box\">\r\n  <div id=\"intro-message\">\r\n    <div id=\"text-box\">\r\n      This site shows the emotions expressed by Twitter users all across Scotland. Each region has a positivity score\r\n      showing overall how positive tweets are from that region.\r\n      <br> <br>\r\n      Interact with the map to view different regions and play with the filters to see what emotions you can uncover.\r\n      <br> <br>\r\n      I would also greatly appreciate it if you could leave your feedback on the website by clicking the \"Leave Feedback\"\r\n      button in the navbar at the top! <i class=\"fas fa-arrow-up\"></i>\r\n      <br><br>\r\n      <button id=\"hide_button\" class=\"btn btn-secondary\" style=\"margin-bottom: 10px;\" (click)=\"hideIntroBox()\">Ok</button>\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n<app-home [endDate]=\"endDate\" [period]=\"period\"></app-home>\r\n\r\n<!--<footer class=\"footer\">-->\r\n  <!--Today-->\r\n  <!--<span *ngIf=\"paused\" (click)=\"togglePaused()\" ><i class=\"fas fa-play\"></i></span>-->\r\n  <!--<span *ngIf=\"!paused\" (click)=\"togglePaused()\"><i class=\"fas fa-pause\"></i></span>-->\r\n  <!--<input type=\"range\" min=\"1\" max=\"100\" [(ngModel)]=\"value\" class=\"slider\" id=\"myRange\">-->\r\n<!--</footer>-->\r\n"

/***/ }),

/***/ "../../../../../src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm2015/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__home_home_component__ = __webpack_require__("../../../../../src/app/home/home.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


let AppComponent = class AppComponent {
    constructor(_changeDetectorRef) {
        this._changeDetectorRef = _changeDetectorRef;
        this.minDate = new Date(2017, 11, 1);
        this.maxDate = new Date();
    }
    ngOnInit() {
        this.endDate = new Date();
        this.period = 3;
    }
    submitDate() {
        this.home.refreshData();
    }
    resetDate() {
        this.ngOnInit();
        this._changeDetectorRef.detectChanges();
        this.submitDate();
    }
    hideIntroBox() {
        document.getElementById('intro-box').style.display = 'none';
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_1__home_home_component__["a" /* HomeComponent */]),
    __metadata("design:type", Object)
], AppComponent.prototype, "home", void 0);
AppComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-root',
        template: __webpack_require__("../../../../../src/app/app.component.html"),
        styles: [__webpack_require__("../../../../../src/app/app.component.css"), __webpack_require__("../../../../../src/assets/css/sticky-footer.css")],
        encapsulation: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewEncapsulation"].None
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]])
], AppComponent);



/***/ }),

/***/ "../../../../../src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__("../../../platform-browser/esm2015/platform-browser.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/esm2015/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__("../../../forms/esm2015/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_common_http__ = __webpack_require__("../../../common/esm2015/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ng2_nvd3__ = __webpack_require__("../../../../ng2-nvd3/build/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ng2_nvd3___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_ng2_nvd3__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_material_tabs__ = __webpack_require__("../../../material/esm2015/tabs.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_material_card__ = __webpack_require__("../../../material/esm2015/card.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__angular_material_datepicker__ = __webpack_require__("../../../material/esm2015/datepicker.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__angular_material_input__ = __webpack_require__("../../../material/esm2015/input.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__angular_material_select__ = __webpack_require__("../../../material/esm2015/select.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__angular_platform_browser_animations__ = __webpack_require__("../../../platform-browser/esm2015/animations.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__nicky_lenaers_ngx_scroll_to__ = __webpack_require__("../../../../@nicky-lenaers/ngx-scroll-to/@nicky-lenaers/ngx-scroll-to.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__app_component__ = __webpack_require__("../../../../../src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__home_home_component__ = __webpack_require__("../../../../../src/app/home/home.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__happy_rank_happy_rank_component__ = __webpack_require__("../../../../../src/app/happy-rank/happy-rank.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__happy_timeline_happy_timeline_component__ = __webpack_require__("../../../../../src/app/happy-timeline/happy-timeline.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__map_glasgow_map_glasgow_map_component__ = __webpack_require__("../../../../../src/app/map/glasgow-map/glasgow-map.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__tweet_box_tweet_box_component__ = __webpack_require__("../../../../../src/app/tweet-box/tweet-box.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__map_scotland_map_scotland_map_component__ = __webpack_require__("../../../../../src/app/map/scotland-map/scotland-map.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__map_edinburgh_map_edinburgh_map_component__ = __webpack_require__("../../../../../src/app/map/edinburgh-map/edinburgh-map.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__services__ = __webpack_require__("../../../../../src/app/_services/index.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__angular_material__ = __webpack_require__("../../../material/esm2015/material.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__word_cloud_word_cloud_component__ = __webpack_require__("../../../../../src/app/word-cloud/word-cloud.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// 3rd Party Imports












// Components








// Services



let AppModule = class AppModule {
};
AppModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_12__app_component__["a" /* AppComponent */],
            __WEBPACK_IMPORTED_MODULE_13__home_home_component__["a" /* HomeComponent */],
            __WEBPACK_IMPORTED_MODULE_14__happy_rank_happy_rank_component__["a" /* HappyRankComponent */],
            __WEBPACK_IMPORTED_MODULE_15__happy_timeline_happy_timeline_component__["a" /* HappyTimelineComponent */],
            __WEBPACK_IMPORTED_MODULE_16__map_glasgow_map_glasgow_map_component__["a" /* GlasgowMapComponent */],
            __WEBPACK_IMPORTED_MODULE_17__tweet_box_tweet_box_component__["a" /* TweetBoxComponent */],
            __WEBPACK_IMPORTED_MODULE_18__map_scotland_map_scotland_map_component__["a" /* ScotlandMapComponent */],
            __WEBPACK_IMPORTED_MODULE_19__map_edinburgh_map_edinburgh_map_component__["a" /* EdinburghMapComponent */],
            __WEBPACK_IMPORTED_MODULE_22__word_cloud_word_cloud_component__["a" /* WordCloudComponent */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_3__angular_common_http__["b" /* HttpClientModule */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["c" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_4_ng2_nvd3__["NvD3Module"],
            __WEBPACK_IMPORTED_MODULE_5__angular_material_tabs__["b" /* MatTabsModule */],
            __WEBPACK_IMPORTED_MODULE_6__angular_material_card__["a" /* MatCardModule */],
            __WEBPACK_IMPORTED_MODULE_8__angular_material_input__["b" /* MatInputModule */],
            __WEBPACK_IMPORTED_MODULE_7__angular_material_datepicker__["a" /* MatDatepickerModule */],
            __WEBPACK_IMPORTED_MODULE_21__angular_material__["b" /* MatNativeDateModule */],
            __WEBPACK_IMPORTED_MODULE_9__angular_material_select__["a" /* MatSelectModule */],
            __WEBPACK_IMPORTED_MODULE_10__angular_platform_browser_animations__["a" /* BrowserAnimationsModule */],
            __WEBPACK_IMPORTED_MODULE_11__nicky_lenaers_ngx_scroll_to__["a" /* ScrollToModule */].forRoot()
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_20__services__["e" /* TweetService */],
            __WEBPACK_IMPORTED_MODULE_20__services__["f" /* WebSocketService */],
            __WEBPACK_IMPORTED_MODULE_20__services__["c" /* GlasgowDataManagerService */],
            __WEBPACK_IMPORTED_MODULE_20__services__["d" /* ScotlandDataManagerService */],
            __WEBPACK_IMPORTED_MODULE_20__services__["b" /* EdinburghDataManagerService */],
            __WEBPACK_IMPORTED_MODULE_20__services__["a" /* DataManagerService */],
            { provide: __WEBPACK_IMPORTED_MODULE_21__angular_material__["a" /* MAT_DATE_LOCALE */], useValue: 'en-GB' }
        ],
        schemas: [__WEBPACK_IMPORTED_MODULE_1__angular_core__["CUSTOM_ELEMENTS_SCHEMA"]],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_12__app_component__["a" /* AppComponent */]]
    })
], AppModule);



/***/ }),

/***/ "../../../../../src/app/happy-rank/happy-rank.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "#happinessChart {\r\n  height: 100%;\r\n  width: 100%;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/happy-rank/happy-rank.component.html":
/***/ (function(module, exports) {

module.exports = "<div id=\"happinessChartContainer\">\n  <nvd3 #rankChart id=\"happinessChart\" [options]=\"barOptions\" [data]=\"barData\"></nvd3>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/happy-rank/happy-rank.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HappyRankComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm2015/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services__ = __webpack_require__("../../../../../src/app/_services/index.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_District__ = __webpack_require__("../../../../../src/app/_models/District.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



/**
 * Component to generate and display a bar chart that shows how happiness ranks between wards
 */
let HappyRankComponent = class HappyRankComponent {
    constructor(_dataManager) {
        this._dataManager = _dataManager;
        this.barOptions = {};
        this.barData = [];
    }
    ngOnInit() {
        this.setOptions();
    }
    /**
     * Reacts to any changes to the @Input variables
     * @param {SimpleChanges} changes
     */
    ngOnChanges(changes) {
        if (changes['ward'] || changes['wards']) {
            this.setData();
        }
    }
    refreshChart() {
        if (this.chart && this.chart.chart) {
            this.chart.chart.update();
        }
    }
    /**
     * Sets the options for the happy rank bar chart
     */
    setOptions() {
        this.barOptions = {
            chart: {
                discretebar: {
                    dispatch: {
                        elementClick: e => this._dataManager.setDistrict(e.data.id)
                    }
                },
                useInteractiveGuideline: true,
                type: 'discreteBarChart',
                yDomain: [0, 100],
                height: 250,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 50,
                    left: 55
                },
                x: d => d.label,
                y: d => d.value,
                showValues: true,
                valueFormat: d => /*(d === this.minValue || d === this.maxValue) ? d.toFixed(0) + '%' : */ '',
                duration: 250,
                wrapLabels: true,
                xAxis: {
                    axisLabel: 'Wards (Ranked)',
                    tickFormat: (d, i) => (i === 0 || i === this.barData[0].values.length) ? d : ''
                },
                yAxis: {
                    axisLabel: 'Positivity',
                    tickFormat: d => d.toFixed(0) + '%',
                    axisLabelDistance: -10
                }
            }
        };
    }
    /**
     * Sets the data for the happy rank bar chart
     */
    setData() {
        const barData = [
            {
                key: 'Wards',
                values: []
            }
        ];
        if (this.wards !== undefined) {
            for (const [key, ward] of Object.entries(this.wards)) {
                if ('average' in ward) {
                    // Line chart data should be sent as an array of series objects.
                    if (!this.minValue || ward.average < this.minValue)
                        this.minValue = ward.average;
                    if (!this.maxValue || ward.average > this.maxValue)
                        this.maxValue = ward.average;
                    barData[0].values.push({
                        value: ward.average,
                        id: key,
                        label: ward.name,
                        color: this.getBarColour(key, ward)
                    });
                }
            }
        }
        barData[0].values.sort((a, b) => b.value - a.value);
        this.barData = barData;
        if (this.barOptions.chart)
            this.barOptions.chart.xAxis.tickFormat = (d, i) => (i === 0 || i === barData[0].values.length - 1) ? d : '';
    }
    getBarColour(key, ward) {
        if (this.ward === ward)
            return '#7CFF6C';
        else if (key === this._dataManager.getMapBoundaryId())
            return '#48BFFF';
        else if (ward.average > 65)
            return 'rgb(135, 141, 210)';
        else if (ward.average < 40)
            return 'rgb(195, 132, 132)';
        else
            return '#B8B9AC';
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_2__models_District__["a" /* District */])
], HappyRankComponent.prototype, "ward", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], HappyRankComponent.prototype, "wards", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('rankChart'),
    __metadata("design:type", Object)
], HappyRankComponent.prototype, "chart", void 0);
HappyRankComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-happy-rank',
        template: __webpack_require__("../../../../../src/app/happy-rank/happy-rank.component.html"),
        styles: [__webpack_require__("../../../../../src/app/happy-rank/happy-rank.component.css"), __webpack_require__("../../../../nvd3/build/nv.d3.css")],
        encapsulation: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewEncapsulation"].None
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__services__["a" /* DataManagerService */]])
], HappyRankComponent);



/***/ }),

/***/ "../../../../../src/app/happy-timeline/happy-timeline.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "#happinessChart {\r\n  height: 100%;\r\n  width: 100%;\r\n}\r\n\r\n.nvd3 .nv-groups .nv-point {\r\n  stroke-opacity: 1 !important;\r\n  stroke-width: 2px;\r\n  -webkit-animation-duration: 1.2s;\r\n          animation-duration: 1.2s;\r\n  -webkit-animation-iteration-count: 1;\r\n          animation-iteration-count: 1;\r\n  -webkit-animation-timing-function: linear;\r\n          animation-timing-function: linear;\r\n}\r\n\r\n@-webkit-keyframes pointPulsate {\r\n  0%    { stroke-width: 5px; }\r\n  50%   { stroke-width: 10px; }\r\n  100%  { stroke-width: 5px; }\r\n}\r\n\r\n@keyframes pointPulsate {\r\n  0%    { stroke-width: 5px; }\r\n  50%   { stroke-width: 10px; }\r\n  100%  { stroke-width: 5px; }\r\n}\r\n\r\n@-webkit-keyframes pointPulsate2 {\r\n  0%    { stroke-width: 5px; }\r\n  50%   { stroke-width: 10px; }\r\n  100%  { stroke-width: 5px; }\r\n}\r\n\r\n@keyframes pointPulsate2 {\r\n  0%    { stroke-width: 5px; }\r\n  50%   { stroke-width: 10px; }\r\n  100%  { stroke-width: 5px; }\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/happy-timeline/happy-timeline.component.html":
/***/ (function(module, exports) {

module.exports = "<div id=\"happinessChartContainer\">\n  <nvd3 #timelineChart id=\"happinessChart\" [options]=\"lineOptions\" [data]=\"lineData\"></nvd3>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/happy-timeline/happy-timeline.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HappyTimelineComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm2015/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_nvd3__ = __webpack_require__("../../../../nvd3/build/nv.d3.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_nvd3___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_nvd3__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_District__ = __webpack_require__("../../../../../src/app/_models/District.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_Colour__ = __webpack_require__("../../../../../src/app/_models/Colour.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/**
 * Component for the generation of a line chart to show happiness over time for a ward
 */
let HappyTimelineComponent = class HappyTimelineComponent {
    constructor(_differs) {
        this._differs = _differs;
        this._differ = this._differs.find({}).create();
    }
    ngOnInit() {
        this.setOptions();
    }
    /**
     * Reacts to the change of any @Input variables
     * @param {SimpleChanges} changes
     */
    ngOnChanges(changes) {
        if (changes['ward']) {
            this.setData();
        }
    }
    ngDoCheck() {
        if (this._differ) {
            const changes = this._differ.diff(this.ward);
            if (changes) {
                this.pulsePoint();
                this.setData();
            }
        }
    }
    refreshChart() {
        if (this.chart && this.chart.chart && this.chart.chart.update) {
            this.chart.chart.update();
        }
    }
    pulsePoint() {
        const element = document.querySelector('.nvd3 .nv-groups .nv-point-' + (this.ward.values.length - 1));
        if (element) {
            if (element.style.animationName === 'pointPulsate') {
                element.style.animationName = 'pointPulsate2';
            }
            else {
                element.style.animationName = 'pointPulsate';
            }
        }
    }
    /**
     * Sets the options for the happy timeline line chart
     */
    setOptions() {
        this.lineOptions = {
            chart: {
                type: 'lineChart',
                yDomain: [0, 100],
                height: 250,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 55
                },
                useInteractiveGuideline: true,
                xAxis: {
                    axisLabel: 'Date',
                    staggerLabels: true,
                    tickFormat: d => d3.time.format('%b %d, %I %p')(new Date(d))
                },
                yAxis: {
                    axisLabel: 'Positivity',
                    tickFormat: d => d.toFixed(1) + '%',
                    axisLabelDistance: -10
                }
            }
        };
        if (this.ward.values && this.ward.values.length > 0)
            this.lineOptions.chart.forceX = [this.ward.values[0].x - 60, this.ward.values[this.ward.values.length - 1].x + 60];
    }
    /**
     * Sets the data for the happy timeline line chart
     */
    setData() {
        if (this.ward.values && this.ward.values.length > 0) {
            if (this.lineOptions) {
                this.lineOptions.chart.forceX = [this.ward.values[0].x - 3000000, this.ward.values[this.ward.values.length - 1].x + 6000000];
            }
            // Line chart data should be sent as an array of series objects.
            this.lineData = [
                {
                    values: this.ward.values,
                    key: 'Positivity',
                    color: __WEBPACK_IMPORTED_MODULE_3__models_Colour__["a" /* Colour */].getColour(this.ward.values[this.ward.values.length - 1].y),
                    area: true // area - set to true if you want this line to turn into a filled area chart.
                }
            ];
            const lastPoint = document.querySelector('.nvd3 .nv-groups .nv-point-' + (this.ward.values.length - 1));
            if (lastPoint) {
                lastPoint.style.stroke = __WEBPACK_IMPORTED_MODULE_3__models_Colour__["a" /* Colour */].getColour((this.ward.values[this.ward.values.length - 1].y >= 50) ? 100 : 0);
                lastPoint.style['stroke-width'] = '5px';
            }
        }
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_2__models_District__["a" /* District */])
], HappyTimelineComponent.prototype, "ward", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('timelineChart'),
    __metadata("design:type", Object)
], HappyTimelineComponent.prototype, "chart", void 0);
HappyTimelineComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-happy-timeline',
        template: __webpack_require__("../../../../../src/app/happy-timeline/happy-timeline.component.html"),
        styles: [__webpack_require__("../../../../../src/app/happy-timeline/happy-timeline.component.css"), __webpack_require__("../../../../nvd3/build/nv.d3.css")],
        encapsulation: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewEncapsulation"].None
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["KeyValueDiffers"]])
], HappyTimelineComponent);



/***/ }),

/***/ "../../../../../src/app/home/home.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "html * {\r\n  font-family: 'Open Sans', sans-serif;\r\n}\r\n\r\nbody {\r\n  /*overflow: hidden;*/\r\n  background-color: #dadada;\r\n}\r\n\r\n.hidden {\r\n  display: none;\r\n}\r\n\r\nhtml, body {\r\n  height: 100%;\r\n}\r\n\r\n#mapBox {\r\n  min-height: 50vh;\r\n  margin-left: 5px;\r\n}\r\n\r\nmat-card.mapCard {\r\n  padding: 0;\r\n}\r\n\r\n#tweets_box {\r\n  height: 100%;\r\n  margin-right: -10px;\r\n}\r\n\r\n@media (max-width: 767px) {\r\n  #tweets_box {\r\n    height: 80vh;\r\n  }\r\n}\r\n\r\n#chart-box {\r\n  border-color: #686666;\r\n  border-style: solid;\r\n  border-radius: 2vh;\r\n  background-color: #9f9f9fb3;\r\n  height: 100%;\r\n  max-height: 85vh;\r\n  width: 80%;\r\n  margin: 4vh auto;\r\n  overflow-x: hidden;\r\n  overflow-y: auto;\r\n}\r\n\r\n.alfa {\r\n  font-family: \"Alfa Slab One\", cursive;\r\n}\r\n\r\n.yuge {\r\n  font-size: 3rem;\r\n}\r\n\r\n.centre {\r\n  text-align: center;\r\n}\r\n\r\n.centre-col {\r\n  height: 100%;\r\n  margin: auto;\r\n}\r\n\r\n.infoBox {\r\n  /*top: 2%;*/\r\n  /*right: 1%;*/\r\n  /*margin: 5% 2%;*/\r\n  /*background-color: #f6f6f6;*/\r\n  max-height: 85vh;\r\n  overflow-y: auto;\r\n}\r\n\r\n#infoBox {\r\n  margin-right: 5px;\r\n}\r\n\r\n#districtInfoBox .header {\r\n  font-size: 2.5rem;\r\n  display: inline-block;\r\n}\r\n\r\n#districtInfoBox .subtitle {\r\n  font-size: 1.2rem;\r\n  display: inline-block;\r\n  margin-left: 10px;\r\n}\r\n\r\n#mapModeTabs {\r\n  width: 100%;\r\n  overflow: auto;\r\n}\r\n\r\n.mat-tab-header {\r\n  background-color: #f6f6f6;\r\n  z-index: 0;\r\n}\r\n\r\n.next-page-chevron {\r\n  width: 100% !important;\r\n  text-align: center;\r\n  z-index: 999;\r\n}\r\n\r\nscore-mark {\r\n  border-radius: 20px;\r\n  border: 2px solid #FFF;\r\n  width: 40px;\r\n  height: 30px;\r\n  background-color: #dadada;\r\n  position: absolute;\r\n  top: -5px;\r\n  right: 10px;\r\n  font-size: 12px;\r\n  line-height: 25px;\r\n  font-family: 'Roboto', sans-serif;\r\n  color: #FFF;\r\n  font-weight: 700;\r\n  text-align: center;\r\n}\r\n\r\ndiv.row {\r\n  margin-top: 10px;\r\n}\r\n\r\nscore-mark.wide {\r\n  width: 60px;\r\n}\r\n\r\nscore-mark.big {\r\n  width: 80px;\r\n  height: 60px;\r\n  border-radius: 30px;\r\n  line-height: 55px;\r\n  font-size: 30px;\r\n}\r\n\r\n.btn.disabled {\r\n  opacity: 0.25;\r\n}\r\n\r\nmat-card-header {\r\n  position: relative;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/home/home.component.html":
/***/ (function(module, exports) {

module.exports = "<div id=\"map-background\">\n  <div class=\"row\">\n    <div id=\"mapBox\" class=\"col col-xl-5 col-lg-8 col-md-8 col-sm-12 col-12\">\n      <mat-card class=\"mapCard\">\n        <mat-tab-group id=\"mapModeTabs\" #mapModeTabs (selectedTabChange)=\"tabChanged($event)\">\n          <mat-tab label=\"Scotland\"></mat-tab>\n          <mat-tab label=\"Glasgow\"></mat-tab>\n          <mat-tab label=\"Edinburgh\"></mat-tab>\n        </mat-tab-group>\n\n        <app-glasgow-map (mapMode)=\"setMode($event)\" [hidden]=\"currentMode!=mapModes.Glasgow\"></app-glasgow-map>\n        <app-scotland-map (mapMode)=\"setMode($event)\" [hidden]=\"currentMode!=mapModes.Scotland\"></app-scotland-map>\n        <app-edinburgh-map (mapMode)=\"setMode($event)\" [hidden]=\"currentMode!=mapModes.Edinburgh\"></app-edinburgh-map>\n      </mat-card>\n    </div>\n    <div\n      class=\"next-page-chevron d-md-none\"\n      [ngx-scroll-to]=\"'#tweets_box'\"\n    ><i class=\"fas fa-angle-down fa-2x\"></i></div>\n    <div id=\"tweets_box\" class=\"col col-xl-2 col-lg-4 col-md-4 col-sm-12 col-12\">\n      <app-tweet-box [ward]=\"district\"></app-tweet-box>\n    </div>\n    <div\n      class=\"next-page-chevron d-lg-none\"\n      [ngx-scroll-to]=\"'#bottom-chevron'\"\n    ><i class=\"hidden-lg-up fas fa-angle-down fa-2x\"></i></div>\n    <div id=\"infoBox\" class=\"col col-xl-5 col-lg-12 col-md-12 col-sm-12 col-12\">\n      <mat-tab-group id=\"infoBoxTabs\" (animationDone)=\"infoBoxTabChanged($event)\">\n        <mat-tab label=\"Overview\">\n          <mat-card id=\"districtInfoBox\" class=\"infoBox\">\n          <mat-card-header>\n            <mat-card-title class=\"header\">{{district.name}}</mat-card-title>\n            <!--<mat-card-subtitle class=\"subtitle\">{{district.prettyAverage}}% Happy</mat-card-subtitle>-->\n            <score-mark class=\"big\" [ngStyle]=\"{ 'background-color': getTweetColour(district.prettyAverage) }\">\n              {{district.prettyAverage | number:'1.0-0'}}%\n            </score-mark>\n          </mat-card-header>\n          <mat-card-content>\n            <app-happy-timeline [ward]=\"district\"></app-happy-timeline>\n            <div class=\"row\" style=\"margin: -20px auto;\">\n              <div class=\"col\">\n                <app-word-cloud></app-word-cloud>\n              </div>\n              <div class=\"col centre-col\">\n                <div class=\"centre yuge alfa\">{{this.district.total}}</div>\n                <h4 class=\"centre alfa\">tweets</h4>\n              </div>\n            </div>\n            <app-happy-rank [ward]=\"district\" [wards]=\"districts\"></app-happy-rank>\n          </mat-card-content>\n        </mat-card>\n        </mat-tab>\n        <mat-tab id=\"tweet_box_tab\" label=\"Tweets\">\n          <div class=\"infoBox\">\n            <mat-tab-group id=\"tweetDateTabs\" (selectedTabChange)=\"tweetDateTabChanged($event)\">\n              <mat-tab *ngFor=\"let tweetDate of tweetDates; trackBy: trackByTweetDate\" label=\"{{tweetDate.title}}\">\n                <div *ngIf=\"!tweetDate.loaded\" style=\"z-index: 9999999; width: 100%; background-color: rgba(0, 0, 0, 0.16)\">\n                  <div class=\"loader\"></div>\n                </div>\n                <mat-card>\n                  <input\n                    matInput\n                    id=\"tweet-search-box\"\n                    placeholder=\"Search\"\n                    [(ngModel)]=\"searchTerm\"\n                    (input)=\"filterTweets(tweetDate.dateString, getDateFilteredTweets(tweetDate).length || 10)\">\n                  <span>Showing tweets 1-{{getDateFilteredTweets(tweetDate).length}} of {{tweetDate.total}}. </span>\n                  <span>\n                    Sort By\n                    <mat-form-field style=\"width: 7rem\">\n                      <mat-select id=\"sort_tweets\" [(value)]=\"sorting\" (selectionChange)=\"sortTweets(tweetDate)\">\n                        <mat-option [value]=\"TweetSorting.DATE_DESC\">Date Desc</mat-option>\n                        <mat-option [value]=\"TweetSorting.DATE_ASC\">Date Asc</mat-option>\n                        <mat-option [value]=\"TweetSorting.SCORE_DESC\">Score Desc</mat-option>\n                        <mat-option [value]=\"TweetSorting.SCORE_ASC\">Score Asc</mat-option>\n                      </mat-select>\n                    </mat-form-field>\n                  </span>\n                  <h3 *ngIf=\"getDateFilteredTweets(tweetDate).length === 0 && tweetDate.loaded\" style=\"background-color: white\">\n                    There are no tweets for the selected date, region and filters\n                  </h3>\n                  <div id=\"fwoop\" *ngIf=\"(getDateFilteredTweets(tweetDate).length > 0) && tweetDate.loaded\">\n                    <div\n                      class=\"tweet_details\"\n                      *ngFor=\"let tweet of getDateFilteredTweets(tweetDate); trackBy: trackByFn\">\n                      <div style=\"border-radius: 10px;\">\n                        <mat-card-header>\n                          <score-mark class=\"wide\" [ngStyle]=\"{ 'background-color': getTweetColour(tweet.score) }\">{{tweet.score | number:'1.0-0'}}%</score-mark>\n                          <mat-card-title class=\"header\">\n                            {{tweet.name}}\n                            <mat-card-subtitle>{{tweet.date | date:'shortTime'}}</mat-card-subtitle>\n                          </mat-card-title>\n                        </mat-card-header>\n                        <mat-card-content>\n                          <p style=\"padding: 0 5px\" [innerHTML]=\"tweet.text\"></p>\n                        </mat-card-content>\n                      </div>\n                      <hr>\n                    </div>\n                  </div>\n                  <button\n                    style=\"width: 100%\" class=\"btn btn-primary\"\n                    *ngIf=\"getDateFilteredTweets(tweetDate).length > 0 && tweetDate.loaded\"\n                    (click)=\"filterTweets(tweetDate.dateString, getDateFilteredTweets(tweetDate).length+50)\">\n                    Load More\n                  </button>\n                </mat-card>\n              </mat-tab>\n            </mat-tab-group>\n          </div>\n        </mat-tab>\n      </mat-tab-group>\n    </div>\n    <div\n      id=\"bottom-chevron\"\n      class=\"next-page-chevron d-lg-none\"\n      [ngx-scroll-to]=\"'#navbar-brand'\"\n      [ngx-scroll-to-duration]=\"1\"\n      [ngx-scroll-to-easing]=\"'easeOutQuint'\"\n    ><i class=\"hidden-lg-up fas fa-angle-double-up fa-2x\"></i></div>\n  </div>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/home/home.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomeComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm2015/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services__ = __webpack_require__("../../../../../src/app/_services/index.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_District__ = __webpack_require__("../../../../../src/app/_models/District.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_material__ = __webpack_require__("../../../material/esm2015/material.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_MapModes__ = __webpack_require__("../../../../../src/app/_models/MapModes.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Subscription__ = __webpack_require__("../../../../rxjs/_esm2015/Subscription.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_moment__ = __webpack_require__("../../../../moment/moment.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__happy_timeline_happy_timeline_component__ = __webpack_require__("../../../../../src/app/happy-timeline/happy-timeline.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__happy_rank_happy_rank_component__ = __webpack_require__("../../../../../src/app/happy-rank/happy-rank.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__models_Colour__ = __webpack_require__("../../../../../src/app/_models/Colour.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var TweetSorting;
(function (TweetSorting) {
    TweetSorting["DATE_DESC"] = "Date Desc";
    TweetSorting["DATE_ASC"] = "Date Asc";
    TweetSorting["SCORE_DESC"] = "Score Desc";
    TweetSorting["SCORE_ASC"] = "Score Asc";
})(TweetSorting || (TweetSorting = {}));
/**
 * The base component for the home screen. Manages the styling of the page as well as the loading and modification
 * of wards data.
 */
let HomeComponent = class HomeComponent {
    constructor(_tweet, _dataManager) {
        this._tweet = _tweet;
        this._dataManager = _dataManager;
        this.TweetSorting = TweetSorting;
        this.district = new __WEBPACK_IMPORTED_MODULE_2__models_District__["a" /* District */]();
        this.districts = {};
        this.mapModes = __WEBPACK_IMPORTED_MODULE_4__models_MapModes__["a" /* MapModes */];
        this.tweetDates = [];
        this.sorting = TweetSorting.DATE_DESC;
        this.searchTerm = '';
        this.tweets = {};
        this.filteredTweets = {};
        this.districtSubscription = new __WEBPACK_IMPORTED_MODULE_5_rxjs_Subscription__["a" /* Subscription */]();
        this.districtsSubscription = new __WEBPACK_IMPORTED_MODULE_5_rxjs_Subscription__["a" /* Subscription */]();
        this.tweetsSubscription = new __WEBPACK_IMPORTED_MODULE_5_rxjs_Subscription__["a" /* Subscription */]();
        this.tabChanged = (tabChangeEvent) => {
            this.setMode(tabChangeEvent.index);
        };
    }
    ngOnInit() {
        this.currentMode = __WEBPACK_IMPORTED_MODULE_4__models_MapModes__["a" /* MapModes */].Scotland;
        this._dataManager.getDataManager().subscribe(dm => {
            if (dm !== undefined) {
                this.subscribeForDistrictData();
            }
        });
        this.colour = __WEBPACK_IMPORTED_MODULE_9__models_Colour__["a" /* Colour */].getColour;
    }
    subscribeForDistrictData() {
        // Manage District Subscription
        if (!this.districtSubscription.closed) {
            this.districtSubscription.unsubscribe();
        }
        this.districtSubscription = this._dataManager.getDistrict().subscribe((district) => {
            this.district = district;
            this.filterTweets(this.currentKey, this.getDateFilteredTweets({ dateString: this.currentKey }).length);
        });
        // Manage Districts Subscription
        if (!this.districtsSubscription.closed) {
            this.districtsSubscription.unsubscribe();
        }
        this.districtsSubscription = this._dataManager.getDistricts().subscribe((districts) => this.districts = districts);
        // Manage Tweets Subscription
        if (!this.tweetsSubscription.closed) {
            this.tweetsSubscription.unsubscribe();
        }
        this.tweetsSubscription = this._dataManager.getTweets().subscribe((tweets) => {
            for (const key of Object.keys(tweets)) {
                this.tweets[key] = tweets[key]
                    .filter(item => (item.area === this._dataManager.districtId || this._dataManager.mapMode === __WEBPACK_IMPORTED_MODULE_4__models_MapModes__["a" /* MapModes */].Scotland))
                    .sort((a, b) => (a.date < b.date) ? -1 : 1);
            }
            Object.keys(this.tweets).forEach(key => {
                if (!tweets.hasOwnProperty(key))
                    delete this.tweets[key];
            });
            this.tweetDates = [];
            const date = __WEBPACK_IMPORTED_MODULE_6_moment__(this.endDate);
            while (date.isAfter(__WEBPACK_IMPORTED_MODULE_6_moment__(this.endDate).subtract(this.period, 'days'))) {
                this.tweetDates.push({
                    dateString: date.format('YYYY-MM-DD'),
                    title: date.format('Do MMM'),
                    loaded: tweets.hasOwnProperty(date.format('YYYY-MM-DD')),
                    total: 0
                });
                date.subtract(1, 'days');
            }
            this.setFilteredTweets();
        });
    }
    refreshData() {
        this._dataManager.refreshAllDistrictsData(this.endDate, this.period);
    }
    setFilteredTweets(limit = 10) {
        const filteredTweets = this.tweets;
        for (const [key] of Object.entries(filteredTweets)) {
            this.filterTweets(key, limit);
        }
    }
    filterTweets(key, limit) {
        this.currentKey = key;
        const ward = this.district.id;
        const filteredTweets = Object.assign({}, this.tweets);
        const searchTermLower = this.searchTerm.toLowerCase();
        let i = 0;
        let totalTweets = 0;
        if (filteredTweets.hasOwnProperty(key)) {
            this.filteredTweets[key] = filteredTweets[key]
                .sort((a, b) => {
                switch (this.sorting) {
                    case TweetSorting.DATE_DESC:
                        return b.date < a.date ? -1 : 1;
                    case TweetSorting.DATE_ASC:
                        return a.date > b.date ? 1 : -1;
                    case TweetSorting.SCORE_DESC:
                        return b.score - a.score;
                    case TweetSorting.SCORE_ASC:
                        return a.score - b.score;
                    default:
                        return 0;
                }
            })
                .filter(tweet => {
                if ((ward === this._dataManager.getMapBoundaryId() || ward === tweet.ward || ward === tweet.area) &&
                    ((tweet.name && tweet.name.toLowerCase().includes(searchTermLower))
                        || (tweet.text && tweet.text.toLowerCase().includes(searchTermLower)))) {
                    totalTweets++;
                    if (i < limit) {
                        i++;
                        return true;
                    }
                    return false;
                }
                return false;
            });
        }
        for (const k in Object.keys(this.tweetDates)) {
            if (this.tweetDates[k].dateString === key) {
                this.tweetDates[k].total = totalTweets;
            }
        }
    }
    getDateFilteredTweets(tweetDate) {
        const key = tweetDate.dateString;
        return (this.filteredTweets.hasOwnProperty(key))
            ? this.filteredTweets[key]
            : [];
    }
    setMode(index) {
        this.mapModeTabs.selectedIndex = index;
        this.currentMode = index;
        this._dataManager.selectDataManager(this.currentMode);
    }
    commonWord(index) {
        return (this.district.common_emote_words && this.district.common_emote_words[index])
            ? this.district.common_emote_words[index].split(',')[0]
            : '';
    }
    tweetDateTabChanged(event) {
        if (!this.tweetDates[event.index].loaded) {
            this._dataManager.fetchDistrictTweets(__WEBPACK_IMPORTED_MODULE_6_moment__(this.tweetDates[event.index].dateString), true);
        }
    }
    trackByFn(index, tweet) {
        return tweet.id;
    }
    trackByTweetDate(index, tweetDate) {
        return tweetDate.dateString;
    }
    infoBoxTabChanged(event) {
        this.timelineChart.refreshChart();
        this.rankChart.refreshChart();
    }
    getTweetColour(score) {
        return this.colour(score);
    }
    sortTweets(dateTweet) {
        this.filterTweets(dateTweet.dateString, this.getDateFilteredTweets(dateTweet).length);
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('mapModeTabs'),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_3__angular_material__["c" /* MatTabGroup */])
], HomeComponent.prototype, "mapModeTabs", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('infoBoxTabs'),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_3__angular_material__["c" /* MatTabGroup */])
], HomeComponent.prototype, "infoBoxTabs", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('tweetDateTabs'),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_3__angular_material__["c" /* MatTabGroup */])
], HomeComponent.prototype, "tweetDateTabs", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_7__happy_timeline_happy_timeline_component__["a" /* HappyTimelineComponent */]),
    __metadata("design:type", Object)
], HomeComponent.prototype, "timelineChart", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_8__happy_rank_happy_rank_component__["a" /* HappyRankComponent */]),
    __metadata("design:type", Object)
], HomeComponent.prototype, "rankChart", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Date)
], HomeComponent.prototype, "endDate", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Number)
], HomeComponent.prototype, "period", void 0);
HomeComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-home',
        template: __webpack_require__("../../../../../src/app/home/home.component.html"),
        styles: [__webpack_require__("../../../../../src/app/home/home.component.css")],
        encapsulation: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewEncapsulation"].None
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__services__["e" /* TweetService */],
        __WEBPACK_IMPORTED_MODULE_1__services__["a" /* DataManagerService */]])
], HomeComponent);



/***/ }),

/***/ "../../../../../src/app/map/edinburgh-map/edinburgh-map.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EdinburghMapComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm2015/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_index__ = __webpack_require__("../../../../../src/app/_services/index.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__map_component__ = __webpack_require__("../../../../../src/app/map/map.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



/**
 * Component for the generation and management of the Glasgow Map
 */
let EdinburghMapComponent = class EdinburghMapComponent extends __WEBPACK_IMPORTED_MODULE_2__map_component__["a" /* MapComponent */] {
    constructor(_edinburghDataManager) {
        super();
        this._edinburghDataManager = _edinburghDataManager;
        this.regionMap = 'edinburgh-map';
        this._dataManager = _edinburghDataManager;
    }
    initVariables() {
        this.projection = d3.geo.albers()
            .center([-0.124, 55.903251])
            .rotate([3.15, 0])
            .parallels([50, 60])
            .scale(220000)
            .translate([this.width / 2, this.height / 2]);
        this.offsetT = document.getElementById('edinburgh-map').offsetTop + 50;
    }
};
EdinburghMapComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-edinburgh-map',
        template: __webpack_require__("../../../../../src/app/map/map.component.html"),
        styles: [__webpack_require__("../../../../../src/app/map/map.component.css")],
        encapsulation: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewEncapsulation"].None
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__services_index__["b" /* EdinburghDataManagerService */]])
], EdinburghMapComponent);



/***/ }),

/***/ "../../../../../src/app/map/glasgow-map/glasgow-map.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GlasgowMapComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm2015/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_index__ = __webpack_require__("../../../../../src/app/_services/index.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__map_component__ = __webpack_require__("../../../../../src/app/map/map.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



/**
 * Component for the generation and management of the Glasgow Map
 */
let GlasgowMapComponent = class GlasgowMapComponent extends __WEBPACK_IMPORTED_MODULE_2__map_component__["a" /* MapComponent */] {
    constructor(_glasgowDataManager) {
        super();
        this._glasgowDataManager = _glasgowDataManager;
        this.regionMap = 'glasgow-map';
        this._dataManager = this._glasgowDataManager;
    }
    initVariables() {
        this.projection = d3.geo.albers()
            .center([-0.139, 55.8442])
            .rotate([4.1, 0])
            .parallels([50, 60])
            .scale(280000)
            .translate([this.width / 2, this.height / 2]);
        this.offsetT = document.getElementById('glasgow-map').offsetTop + 50;
    }
};
GlasgowMapComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-glasgow-map',
        template: __webpack_require__("../../../../../src/app/map/map.component.html"),
        styles: [__webpack_require__("../../../../../src/app/map/map.component.css")],
        encapsulation: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewEncapsulation"].None
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__services_index__["c" /* GlasgowDataManagerService */]])
], GlasgowMapComponent);



/***/ }),

/***/ "../../../../../src/app/map/map.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "div.tooltip {\r\n  color: #222;\r\n  background: #fff;\r\n  border-radius: 3px;\r\n  box-shadow: 0 0 2px 0 #a6a6a6;\r\n  padding: .2em;\r\n  text-shadow: #f5f5f5 0 1px 0;\r\n  opacity: 0.9;\r\n  position: absolute;\r\n}\r\n\r\n.districts {\r\n  cursor: pointer;\r\n  stroke: #000;\r\n  -webkit-animation-duration: 1.2s;\r\n          animation-duration: 1.2s;\r\n  -webkit-animation-iteration-count: 1;\r\n          animation-iteration-count: 1;\r\n  -webkit-animation-timing-function: linear;\r\n          animation-timing-function: linear;\r\n}\r\n\r\n.districts:hover {\r\n  fill: #a2a2a2;\r\n}\r\n\r\n.boundary:hover {\r\n  stroke: #a2a2a2;\r\n}\r\n\r\n.place-label {\r\n  pointer-events:none;\r\n}\r\n\r\n.districts.selected {\r\n  stroke-width: 5px;\r\n}\r\n\r\n.area-map {\r\n  text-align: center;\r\n  width: 100%;\r\n}\r\n\r\n.map-title {\r\n  margin: 1%;\r\n}\r\n\r\n.area-map svg {\r\n  /*max-height: 80vh;*/\r\n  left: 0;\r\n  position: relative;\r\n  width: 100%\r\n}\r\n\r\ndiv.row {\r\n  margin-right: 0;\r\n}\r\n\r\n\r\n/*@media (min-width: 992px) {*/\r\n  /*#map-container {*/\r\n    /*max-width: 40vw;*/\r\n  /*}*/\r\n/*}*/\r\n\r\n/*@media (min-width: 768px) and (max-width: 991px) {*/\r\n  /*#map-container {*/\r\n    /*max-width: 70vw;*/\r\n  /*}*/\r\n/*}*/\r\n\r\n/*@media (max-width: 767px) {*/\r\n  /*#map-container svg {*/\r\n    /*!*width: 130vw;*!*/\r\n    /*height: 85vh;*/\r\n  /*}*/\r\n/*}*/\r\n\r\n.svgMap {\r\n  max-height: 75vh;\r\n}\r\n\r\n.legend {\r\n  font-size: 20px;\r\n}\r\n\r\n.boundary {\r\n  fill: none;\r\n  stroke-linejoin: round;\r\n  stroke-width: 4vh !important;\r\n  cursor: pointer;\r\n  -webkit-animation-duration: 0.5s;\r\n          animation-duration: 0.5s;\r\n  -webkit-animation-iteration-count: 1;\r\n          animation-iteration-count: 1;\r\n  -webkit-animation-timing-function: linear;\r\n          animation-timing-function: linear;\r\n}\r\n\r\n.btn.zoom {\r\n  float: right;\r\n  margin-right: 2vw;\r\n  border-radius: 3vw;\r\n}\r\n\r\n@-webkit-keyframes regionPulsate {\r\n  0%    { stroke-width: 4vh; }\r\n  50%   { stroke-width: 6vh; }\r\n  100%  { stroke-width: 4vh; }\r\n}\r\n\r\n@keyframes regionPulsate {\r\n  0%    { stroke-width: 4vh; }\r\n  50%   { stroke-width: 6vh; }\r\n  100%  { stroke-width: 4vh; }\r\n}\r\n\r\n@-webkit-keyframes regionPulsate2 {\r\n  0%    { stroke-width: 4vh; }\r\n  50%   { stroke-width: 6vh; }\r\n  100%  { stroke-width: 4vh; }\r\n}\r\n\r\n@keyframes regionPulsate2 {\r\n  0%    { stroke-width: 4vh; }\r\n  50%   { stroke-width: 6vh; }\r\n  100%  { stroke-width: 4vh; }\r\n}\r\n\r\n@-webkit-keyframes districtPulsate {\r\n  0%    { stroke-width: 1px; }\r\n  50%   { stroke-width: 6px; }\r\n  100%  { stroke-width: 1px; }\r\n}\r\n\r\n@keyframes districtPulsate {\r\n  0%    { stroke-width: 1px; }\r\n  50%   { stroke-width: 6px; }\r\n  100%  { stroke-width: 1px; }\r\n}\r\n\r\n@-webkit-keyframes districtPulsate2 {\r\n  0%    { stroke-width: 1px; }\r\n  50%   { stroke-width: 6px; }\r\n  100%  { stroke-width: 1px; }\r\n}\r\n\r\n@keyframes districtPulsate2 {\r\n  0%    { stroke-width: 1px; }\r\n  50%   { stroke-width: 6px; }\r\n  100%  { stroke-width: 1px; }\r\n}\r\n\r\n/*Page loading spinner*/\r\n.loader {\r\n  position: absolute;\r\n  left: 50%;\r\n  top: 50%;\r\n  border: 16px solid #f3f3f3; /* Light grey */\r\n  border-top: 16px solid #3498db; /* Blue */\r\n  border-radius: 50%;\r\n  width: 120px;\r\n  height: 120px;\r\n  -webkit-animation: spin 2s linear infinite;\r\n          animation: spin 2s linear infinite;\r\n}\r\n\r\n@-webkit-keyframes spin {\r\n  0% { -webkit-transform: rotate(0deg); transform: rotate(0deg); }\r\n  100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); }\r\n}\r\n\r\n@keyframes spin {\r\n  0% { -webkit-transform: rotate(0deg); transform: rotate(0deg); }\r\n  100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); }\r\n}\r\n\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/map/map.component.html":
/***/ (function(module, exports) {

module.exports = "<div id=\"map-container\">\n  <div *ngIf=\"!loaded\" style=\"z-index: 9999999; height:100%; width: 100%; background-color: rgba(0, 0, 0, 0.16)\">\n    <div class=\"loader\"></div>\n  </div>\n\n  <div [hidden]=\"!loaded\" class=\"map-title header mat-card-title\">\n    {{district.name}}\n    <button *ngIf=\"regionMap === 'scotland-map' && canZoomIn()\" class=\"btn btn-secondary zoom\" (click)=\"zoomMapIn()\"><i class=\"fas fa-search-plus fa-2x\"></i></button>\n    <button *ngIf=\"regionMap !== 'scotland-map'\" class=\"btn btn-secondary zoom\" (click)=\"zoomMapOut()\"><i class=\"fas fa-search-minus fa-2x\"></i></button>\n  </div>\n\n  <div [hidden]=\"!loaded\" [id]=\"regionMap\" class=\"area-map\"></div>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/map/map.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm2015/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_topojson__ = __webpack_require__("../../../../topojson/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_District__ = __webpack_require__("../../../../../src/app/_models/District.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_util__ = __webpack_require__("../../../../util/util.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_util___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_util__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_MapModes__ = __webpack_require__("../../../../../src/app/_models/MapModes.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_Colour__ = __webpack_require__("../../../../../src/app/_models/Colour.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






class MapComponent {
    constructor() {
        this.mapMode = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.loaded = false;
        this.district = new __WEBPACK_IMPORTED_MODULE_2__models_District__["a" /* District */]();
        this.districts = {};
        this.margin = { top: 20, right: 20, bottom: 0, left: 50 };
        this.mapModeMapping = {
            'S12000046': __WEBPACK_IMPORTED_MODULE_4__models_MapModes__["a" /* MapModes */].Glasgow,
            'S12000036': __WEBPACK_IMPORTED_MODULE_4__models_MapModes__["a" /* MapModes */].Edinburgh
        };
        this.circlePulse = (d) => {
            this.svg.select('#' + d.id)
                .transition()
                .duration(2000)
                .attr('stroke-width', 0.5)
                .attr('r', 12)
                .ease('sine')
                .transition()
                .duration(2000)
                .attr('stroke-width', 10)
                .attr('r', 0)
                .remove();
        };
        // Event Handlers //
        /**
         * Emits the id of the selected district
         * @param e
         */
        this.setData = (e) => {
            const id = this.isFeature(e) ? e.properties[this._dataManager.topologyId] : this._dataManager.getMapBoundaryId();
            this._dataManager.setDistrict(id);
        };
        this.changeMap = (e) => {
            const id = this.isFeature(e) ? e.properties[this._dataManager.topologyId] : this._dataManager.getMapBoundaryId();
            if (id === this._dataManager.districtId) {
                this.mapMode.emit(this._dataManager.mapMode);
            }
        };
        /**
         * Displays the tooltip for the district hovered over at the appropriate place on the screen
         * @param d
         */
        this.showTooltip = (d) => {
            const id = d.properties ? d.properties[this._dataManager.topologyId] : this._dataManager.getMapBoundaryId();
            const label = (d.properties ? d.properties[this._dataManager.topologyName] : this._dataManager.regionName) +
                '<br> ' + this.districts[id].prettyAverage + '% Positive';
            const e = d3.event;
            this.tooltip.classed('hidden', false)
                .attr('style', 'left:' + (e.layerX + 10) + 'px;top:' + (e.layerY + this.offsetT) + 'px')
                .html(label);
        };
        this.width = 1000 - this.margin.left - this.margin.right;
        this.height = 1000 - this.margin.top - this.margin.bottom;
    }
    ngOnInit() {
        this._dataManager.getDistricts()
            .subscribe((districts) => {
            this.districts = districts;
            if (this.districts)
                this.updateMapColours();
        });
        this._dataManager.getLoadedData()
            .subscribe((loaded) => {
            this.loaded = loaded;
        });
        this._dataManager.getDistrict().subscribe((district) => {
            this.district = district;
            if (district)
                this.setStyling(district.id);
        });
        this._dataManager.getLatestTweet().subscribe((tweet) => {
            if (tweet !== undefined) {
                if (tweet.id !== (this._dataManager.getMapBoundaryId())) {
                    if (tweet.coordinates)
                        this.drawPoint(tweet);
                    this.pulsateDistrictElement(tweet.id);
                }
                if (this._dataManager.allowRegionPulsing) {
                    this.pulsateRegionElement();
                }
            }
        });
        this._dataManager.getMapTopology().subscribe((topology) => this.topologySubscription(topology));
    }
    ngAfterViewInit() {
        this.initVariables();
        this.sharedInit();
    }
    topologySubscription(topology) {
        if (topology) {
            if (this.districts)
                this.drawMap(topology);
            else
                setInterval(this.topologySubscription(topology), 500);
        }
    }
    canZoomIn() {
        return this.mapModeMapping.hasOwnProperty(this.district.id);
    }
    zoomMapIn() {
        if (this.mapModeMapping.hasOwnProperty(this.district.id)) {
            this.mapMode.emit(this.mapModeMapping[this.district.id]);
        }
    }
    zoomMapOut() {
        this.mapMode.emit(__WEBPACK_IMPORTED_MODULE_4__models_MapModes__["a" /* MapModes */].Scotland);
    }
    sharedInit() {
        // Create svg for graph to be drawn in
        this.svg = d3.select('#' + this.regionMap)
            .append('svg')
            .attr('id', this._dataManager.mapType + '-mapp')
            .attr('class', 'svgMap')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', '0 0 ' + this.width + ' ' + this.height);
        this.path = d3.geo.path().projection(this.projection);
        this.tooltip = d3.select('#' + this.regionMap)
            .append('div')
            .attr('class', 'tooltip hidden');
    }
    pulsateRegionElement() {
        const element = document.getElementById(this._dataManager.getMapBoundaryId());
        if (element) {
            if (element.style.animationName === 'regionPulsate') {
                element.style.animationName = 'regionPulsate2';
            }
            else {
                element.style.animationName = 'regionPulsate';
            }
        }
    }
    pulsateDistrictElement(id) {
        const element = document.getElementById(id);
        if (element) {
            if (element.style.animationName === 'districtPulsate') {
                element.style.animationName = 'districtPulsate2';
            }
            else {
                element.style.animationName = 'districtPulsate';
            }
        }
    }
    /**
     * Draws map when topology has been parsed
     * @param topology
     */
    drawMap(topology) {
        if (topology !== undefined) {
            // Draw map outline
            this.drawRegionOutline(topology);
            // Draw each district polygon
            this.drawDistricts(topology);
            this.renderLegend();
        }
    }
    /**
     *
     */
    renderLegend() {
        const legend = this.svg.selectAll('g.legend')
            .data(__WEBPACK_IMPORTED_MODULE_5__models_Colour__["a" /* Colour */].getColourDomain())
            .enter().append('g')
            .attr('class', 'legend');
        const ls_w = 30, ls_h = 30;
        legend.append('rect')
            .attr('x', this.width - (ls_w * 6))
            .attr('y', (d, i) => this.height - (i * ls_h) - 2 * ls_h)
            .attr('width', ls_w)
            .attr('height', ls_h)
            .style('fill', (d, i) => __WEBPACK_IMPORTED_MODULE_5__models_Colour__["a" /* Colour */].getColour(d))
            .style('opacity', 0.8);
        legend.append('text')
            .attr('x', this.width - (ls_w * 4.5))
            .attr('y', (d, i) => this.height - (i * ls_h) - ls_h - 4)
            .text((d, i) => __WEBPACK_IMPORTED_MODULE_5__models_Colour__["a" /* Colour */].getColourDomainLabels()[i]);
        legend.append('text')
            .attr('x', this.width - (ls_w * 6))
            .attr('y', () => this.height - (__WEBPACK_IMPORTED_MODULE_5__models_Colour__["a" /* Colour */].getColourDomain().length * ls_h) - ls_h - 4)
            .text('Percent Positive');
    }
    /**
     * Draws the districts that exist in the topology passed in.
     * @param topology
     */
    drawDistricts(topology) {
        this.svg.append('g').selectAll('path')
            .data(topology.features) // Read in the array of features from the topology data
            .enter()
            .append('path') // Add a path element
            .attr('class', d => 'districts ' + d.properties[this._dataManager.topologyId])
            .attr('d', this.path)
            .attr('fill', d => {
            const average = (this.districts.hasOwnProperty(d.properties[this._dataManager.topologyId]))
                ? this.districts[d.properties[this._dataManager.topologyId]].average
                : 50;
            return __WEBPACK_IMPORTED_MODULE_5__models_Colour__["a" /* Colour */].getColour(average);
        })
            .attr('id', d => d.properties[this._dataManager.topologyId])
            .on('click', this.setData)
            .on('dblclick', this.changeMap)
            .on('mousemove', this.showTooltip)
            .on('mouseout', () => {
            this.tooltip.classed('hidden', true);
        });
    }
    updateMapColours() {
        if (this.svg) {
            for (const [key, value] of Object.entries(this.districts)) {
                this.svg
                    .select('path#' + key)
                    .attr((key === this._dataManager.getMapBoundaryId()) ? 'stroke' : 'fill', () => __WEBPACK_IMPORTED_MODULE_5__models_Colour__["a" /* Colour */].getColour(value.average));
            }
        }
    }
    /**
     * Draws the outline of the district in the topology passed in. Only draws outer boundaries
     * @param t
     */
    drawRegionOutline(t) {
        const topology = __WEBPACK_IMPORTED_MODULE_1_topojson__["b" /* topology */]([t], null);
        this.svg.append('path')
            .datum(__WEBPACK_IMPORTED_MODULE_1_topojson__["a" /* mesh */](topology, topology.objects[0], (a, b) => a === b))
            .attr('d', this.path)
            .attr('stroke', () => __WEBPACK_IMPORTED_MODULE_5__models_Colour__["a" /* Colour */].getColour(this.districts[this._dataManager.getMapBoundaryId()].average))
            .attr('id', this._dataManager.getMapBoundaryId())
            .attr('class', 'boundary selected')
            .on('click', this.setData)
            .on('mousemove', this.showTooltip)
            .on('mouseout', () => {
            this.tooltip.classed('hidden', true);
        });
    }
    drawPoint(tweet) {
        if (Object(__WEBPACK_IMPORTED_MODULE_3_util__["isNumber"])(tweet.coordinates[0])) {
            const coordinates = this.projection(tweet.coordinates);
            this.svg
                .append('circle')
                .attr('id', ('c' + coordinates[0] + coordinates[1]).replace(/\./g, ''))
                .attr('cx', () => coordinates[0])
                .attr('cy', () => coordinates[1])
                .attr('r', '4px')
                .attr('fill', __WEBPACK_IMPORTED_MODULE_5__models_Colour__["a" /* Colour */].getColour(tweet.score))
                .call(d => this.circlePulse(d[0][0]));
        }
    }
    isFeature(object) {
        return 'properties' in object;
    }
    /**
     * Sets the css styling based on which ward is selected.
     * @param {string} area - id of the selected ward
     */
    setStyling(area) {
        if (area) {
            this.clearSelectedClass();
            if (document.getElementById(area))
                document.getElementById(area).classList.add('selected');
        }
    }
    /**
     * Removes the selected class from all wards drawn on the map
     */
    clearSelectedClass() {
        if (this.districts) {
            for (const [key] of Object.entries(this.districts)) {
                if (document.getElementById(key))
                    document.getElementById(key).classList.remove('selected');
            }
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MapComponent;

__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"])
], MapComponent.prototype, "mapMode", void 0);


/***/ }),

/***/ "../../../../../src/app/map/scotland-map/scotland-map.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ScotlandMapComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm2015/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_index__ = __webpack_require__("../../../../../src/app/_services/index.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__map_component__ = __webpack_require__("../../../../../src/app/map/map.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



/**
 * Component for the generation and management of the Scotland Map
 */
let ScotlandMapComponent = class ScotlandMapComponent extends __WEBPACK_IMPORTED_MODULE_2__map_component__["a" /* MapComponent */] {
    constructor(_scotlandDataManager) {
        super();
        this._scotlandDataManager = _scotlandDataManager;
        this.regionMap = 'scotland-map';
        this._dataManager = _scotlandDataManager;
    }
    initVariables() {
        this.projection = d3.geo.albers()
            .center([-0.9959, 57.80153])
            .rotate([3.1, 0])
            .parallels([50, 60])
            .scale(8500)
            .translate([this.width / 2, this.height / 2]);
        this.offsetT = document.getElementById('map-background')
            ? document.getElementById('map-background').offsetTop - 20
            : 0;
    }
};
ScotlandMapComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-scotland-map',
        template: __webpack_require__("../../../../../src/app/map/map.component.html"),
        styles: [__webpack_require__("../../../../../src/app/map/map.component.css")],
        encapsulation: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewEncapsulation"].None
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__services_index__["d" /* ScotlandDataManagerService */]])
], ScotlandMapComponent);



/***/ }),

/***/ "../../../../../src/app/tweet-box/tweet-box.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "#tweet_box {\r\n  top: 2%;\r\n  right: 1%;\r\n  /*border: black solid;*/\r\n  background-color: white;\r\n  max-height: 85vh;\r\n  width: 100%;\r\n  overflow-y: auto;\r\n  /*right: 0;*/\r\n  position: absolute;\r\n  /*top: 10px;*/\r\n  /*border-radius: 2vh;*/\r\n  color: #14171a;\r\n  font-family: 'Segoe UI',Arial,sans-serif;\r\n}\r\n\r\n#infoBox {\r\n  padding-right: 0;\r\n}\r\n\r\n#tweet_box {\r\n  padding: 10px 15px;\r\n}\r\n\r\n@media (max-width: 767px) {\r\n  #tweet_box {\r\n    margin: 0 4%;\r\n    width: 90%;\r\n  }\r\n}\r\n\r\n.tweet_mark {\r\n  position: initial;\r\n}\r\n\r\n#tweet_box .header {\r\n  font-size: 1.5rem;\r\n  display: inline-block;\r\n}\r\n\r\n#tweet_box p {\r\n  font-size: 1rem;\r\n  display: inline-block;\r\n  margin-left: 10px;\r\n}\r\n\r\n.good_word {\r\n  color: #3e3e86;\r\n  -webkit-filter: drop-shadow(0 0 3px dodgerblue);\r\n          filter: drop-shadow(0 0 3px dodgerblue);\r\n}\r\n\r\n.bad_word {\r\n  color: #bf4545;\r\n  -webkit-filter: drop-shadow(0 0 3px salmon);\r\n          filter: drop-shadow(0 0 3px salmon);\r\n}\r\n\r\n.pause-tweets {\r\n  margin-bottom: 30px;\r\n  height: 30px;\r\n  line-height: 18px;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/tweet-box/tweet-box.component.html":
/***/ (function(module, exports) {

module.exports = "<!--<div id=\"tweet_box\">-->\n  <!--<h3 style=\"margin-left: 25px; font-weight: bold;\">{{ward.last_tweet.user.name}}</h3>-->\n  <!--<h5 style=\"margin-left: 30px;\">{{ward.last_tweet.text}}</h5>-->\n<!--</div>-->\n<mat-card id=\"tweet_box\">\n  <button id=\"pause_button\" class=\"btn btn-secondary pause-tweets\" (click)=\"toggleLiveTweets()\"\n          [innerHTML]=\"pauseButtonText\">\n  </button>\n  <div class=\"tweet_details\" *ngFor=\"let tweet of ward.last_tweets; trackBy: trackByFn\">\n    <div [id]=\"'T'+tweet.user.id+tweet.date.substring(tweet.date.length - 4)\">\n      <mat-card-header>\n        <score-mark class=\"tweet_mark\" [ngStyle]=\"{ 'background-color': getTweetColour(tweet.score) }\">{{tweet.score | number:'1.0-0'}}%</score-mark>\n        <mat-card-title class=\"header\">\n          {{tweet.user.name}}\n          <mat-card-subtitle>{{tweet.date | date:'shortTime'}}</mat-card-subtitle>\n        </mat-card-title>\n      </mat-card-header>\n      <mat-card-content>\n        <p [innerHTML]=\"tweet.text\"></p>\n      </mat-card-content>\n    </div>\n    <hr>\n  </div>\n</mat-card>\n"

/***/ }),

/***/ "../../../../../src/app/tweet-box/tweet-box.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TweetBoxComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm2015/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models_District__ = __webpack_require__("../../../../../src/app/_models/District.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services__ = __webpack_require__("../../../../../src/app/_services/index.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_Colour__ = __webpack_require__("../../../../../src/app/_models/Colour.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




let TweetBoxComponent = class TweetBoxComponent {
    constructor(_dataManager) {
        this._dataManager = _dataManager;
        this.pauseButtonLabels = {
            'true': 'Pause Live Feed <i class="fas fa-pause" style="margin-left: 5px;"></i>',
            'false': 'Resume Live Feed <i class="fas fa-play" style="margin-left: 5px;"></i>'
        };
        this.liveTweets = true;
        this.colour = __WEBPACK_IMPORTED_MODULE_3__models_Colour__["a" /* Colour */].getColour;
    }
    ngOnInit() {
    }
    ngAfterViewChecked() {
        const tweet = this.ward.last_tweets[0];
        if (this.mostRecentTweet !== tweet) {
            const listBox = document.querySelector('#tweet_box');
            if (listBox.scrollTop !== 0) {
                const latestTweet = document.querySelector('#T' + tweet.user.id + tweet.date.substring(tweet.date.length - 4));
                listBox.scrollTop += latestTweet.offsetHeight;
            }
            this.mostRecentTweet = tweet;
        }
    }
    get pauseButtonText() {
        return this.pauseButtonLabels[this.liveTweets.toString()];
    }
    trackByFn(index, tweet) {
        return tweet.id;
    }
    toggleLiveTweets() {
        this.liveTweets = !this.liveTweets;
        this._dataManager.setUpdateTweets(this.liveTweets);
    }
    ngOnChanges(changes) {
        if (changes['ward']) {
            // console.log("changes - ward - tweet-box", this.ward);
        }
    }
    getTweetBorder(score) {
        return '2px solid ' + this.colour(score);
    }
    getTweetColour(score) {
        return this.colour(score);
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1__models_District__["a" /* District */])
], TweetBoxComponent.prototype, "ward", void 0);
TweetBoxComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-tweet-box',
        template: __webpack_require__("../../../../../src/app/tweet-box/tweet-box.component.html"),
        styles: [__webpack_require__("../../../../../src/app/tweet-box/tweet-box.component.css")],
        encapsulation: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewEncapsulation"].None
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__services__["a" /* DataManagerService */]])
], TweetBoxComponent);



/***/ }),

/***/ "../../../../../src/app/word-cloud/word-cloud.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/word-cloud/word-cloud.component.html":
/***/ (function(module, exports) {

module.exports = "<div id=\"wordcloud\"></div>\n"

/***/ }),

/***/ "../../../../../src/app/word-cloud/word-cloud.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WordCloudComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm2015/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_d3_cloud__ = __webpack_require__("../../../../d3-cloud/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_d3_cloud___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_d3_cloud__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services__ = __webpack_require__("../../../../../src/app/_services/index.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_Colour__ = __webpack_require__("../../../../../src/app/_models/Colour.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_Subscription__ = __webpack_require__("../../../../rxjs/_esm2015/Subscription.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





let WordCloudComponent = class WordCloudComponent {
    constructor(_dataManager) {
        this._dataManager = _dataManager;
        this.districtSubscription = new __WEBPACK_IMPORTED_MODULE_4_rxjs_Subscription__["a" /* Subscription */]();
        this.tweetSubscription = new __WEBPACK_IMPORTED_MODULE_4_rxjs_Subscription__["a" /* Subscription */]();
        this.tweetCount = 10;
        this.drawWordCloud = (words) => {
            const cloud = this.svg.selectAll('g text')
                .data(words, d => d.text);
            // Entering words
            cloud.enter()
                .append('text')
                .style('font-family', 'Impact')
                .style('fill', d => __WEBPACK_IMPORTED_MODULE_3__models_Colour__["a" /* Colour */].getColour(d.value))
                .attr('text-anchor', 'middle')
                .attr('font-size', 1)
                .text(d => d.text);
            // Entering and existing words
            cloud
                .transition()
                .duration(600)
                .style('font-size', d => d.size + 'px')
                .attr('transform', d => 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')')
                .style('fill-opacity', 1);
            // Exiting words
            cloud.exit()
                .transition()
                .duration(200)
                .style('fill-opacity', 1e-6)
                .attr('font-size', 1)
                .remove();
        };
    }
    ngAfterViewInit() {
        this.svg = d3.select('#wordcloud').append('svg')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', '0 0 ' + 500 + ' ' + 500)
            .append('g')
            .attr('transform', 'translate(250,250)');
        this._dataManager.getDataManager().subscribe(dm => {
            if (dm !== undefined) {
                this.subscribeForDistrictData();
            }
        });
    }
    subscribeForDistrictData() {
        if (!this.tweetSubscription.closed) {
            this.tweetSubscription.unsubscribe();
        }
        this.tweetSubscription = this._dataManager.getLatestTweet().subscribe((tweet) => {
            if (this.district) {
                if (this.tweetCount === 0) {
                    this.generateLayout();
                    this.tweetCount = 10;
                }
                this.tweetCount--;
            }
        });
        if (!this.districtSubscription.closed) {
            this.districtSubscription.unsubscribe();
        }
        this.districtSubscription = this._dataManager.getDistrict().subscribe((district) => {
            this.district = district;
            this.generateLayout();
        });
    }
    generateLayout() {
        if (this.district.common_emote_words) {
            let max;
            this.layout = __WEBPACK_IMPORTED_MODULE_1_d3_cloud__()
                .size([500, 500])
                .words(Object.values(this.district.common_emote_words).map(d => {
                if (max === undefined || d.freq > max)
                    max = d.freq;
                return { text: d.word, size: d.freq, test: 'haha', value: d.score };
            }))
                .padding(5)
                .font('Impact')
                .fontSize(d => {
                const size = 90 * d.size / max;
                if (size > 5)
                    return size;
            })
                .on('end', this.drawWordCloud);
            this.layout.start();
        }
        else {
            this.drawWordCloud([]);
        }
    }
};
WordCloudComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-word-cloud',
        template: __webpack_require__("../../../../../src/app/word-cloud/word-cloud.component.html"),
        styles: [__webpack_require__("../../../../../src/app/word-cloud/word-cloud.component.css")],
        encapsulation: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewEncapsulation"].None
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__services__["a" /* DataManagerService */]])
], WordCloudComponent);



/***/ }),

/***/ "../../../../../src/assets/css/sticky-footer.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "/* Sticky footer styles\n-------------------------------------------------- */\nhtml {\n  position: relative;\n  min-height: 100%;\n}\nbody {\n  margin-bottom: 3vh; /* Margin bottom by footer height */\n}\n.footer {\n  position: absolute;\n  bottom: 0;\n  width: 100%;\n  height: 3vh; /* Set the fixed height of the footer here */\n  line-height: 3vh; /* Vertically center the text there */\n  background-color: #757575;\n}\n\n\n/* Custom page CSS\n-------------------------------------------------- */\n/* Not required for template or sticky footer method. */\n\n.container {\n  width: auto;\n  max-width: 680px;\n  padding: 0 15px;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
const environment = {
    production: false
};
/* harmony export (immutable) */ __webpack_exports__["a"] = environment;



/***/ }),

/***/ "../../../../../src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm2015/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("../../../platform-browser-dynamic/esm2015/platform-browser-dynamic.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("../../../../../src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["enableProdMode"])();
}
Object(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */])
    .catch(err => console.log(err));


/***/ }),

/***/ "../../../../moment/locale recursive ^\\.\\/.*$":
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": "../../../../moment/locale/af.js",
	"./af.js": "../../../../moment/locale/af.js",
	"./ar": "../../../../moment/locale/ar.js",
	"./ar-dz": "../../../../moment/locale/ar-dz.js",
	"./ar-dz.js": "../../../../moment/locale/ar-dz.js",
	"./ar-kw": "../../../../moment/locale/ar-kw.js",
	"./ar-kw.js": "../../../../moment/locale/ar-kw.js",
	"./ar-ly": "../../../../moment/locale/ar-ly.js",
	"./ar-ly.js": "../../../../moment/locale/ar-ly.js",
	"./ar-ma": "../../../../moment/locale/ar-ma.js",
	"./ar-ma.js": "../../../../moment/locale/ar-ma.js",
	"./ar-sa": "../../../../moment/locale/ar-sa.js",
	"./ar-sa.js": "../../../../moment/locale/ar-sa.js",
	"./ar-tn": "../../../../moment/locale/ar-tn.js",
	"./ar-tn.js": "../../../../moment/locale/ar-tn.js",
	"./ar.js": "../../../../moment/locale/ar.js",
	"./az": "../../../../moment/locale/az.js",
	"./az.js": "../../../../moment/locale/az.js",
	"./be": "../../../../moment/locale/be.js",
	"./be.js": "../../../../moment/locale/be.js",
	"./bg": "../../../../moment/locale/bg.js",
	"./bg.js": "../../../../moment/locale/bg.js",
	"./bm": "../../../../moment/locale/bm.js",
	"./bm.js": "../../../../moment/locale/bm.js",
	"./bn": "../../../../moment/locale/bn.js",
	"./bn.js": "../../../../moment/locale/bn.js",
	"./bo": "../../../../moment/locale/bo.js",
	"./bo.js": "../../../../moment/locale/bo.js",
	"./br": "../../../../moment/locale/br.js",
	"./br.js": "../../../../moment/locale/br.js",
	"./bs": "../../../../moment/locale/bs.js",
	"./bs.js": "../../../../moment/locale/bs.js",
	"./ca": "../../../../moment/locale/ca.js",
	"./ca.js": "../../../../moment/locale/ca.js",
	"./cs": "../../../../moment/locale/cs.js",
	"./cs.js": "../../../../moment/locale/cs.js",
	"./cv": "../../../../moment/locale/cv.js",
	"./cv.js": "../../../../moment/locale/cv.js",
	"./cy": "../../../../moment/locale/cy.js",
	"./cy.js": "../../../../moment/locale/cy.js",
	"./da": "../../../../moment/locale/da.js",
	"./da.js": "../../../../moment/locale/da.js",
	"./de": "../../../../moment/locale/de.js",
	"./de-at": "../../../../moment/locale/de-at.js",
	"./de-at.js": "../../../../moment/locale/de-at.js",
	"./de-ch": "../../../../moment/locale/de-ch.js",
	"./de-ch.js": "../../../../moment/locale/de-ch.js",
	"./de.js": "../../../../moment/locale/de.js",
	"./dv": "../../../../moment/locale/dv.js",
	"./dv.js": "../../../../moment/locale/dv.js",
	"./el": "../../../../moment/locale/el.js",
	"./el.js": "../../../../moment/locale/el.js",
	"./en-au": "../../../../moment/locale/en-au.js",
	"./en-au.js": "../../../../moment/locale/en-au.js",
	"./en-ca": "../../../../moment/locale/en-ca.js",
	"./en-ca.js": "../../../../moment/locale/en-ca.js",
	"./en-gb": "../../../../moment/locale/en-gb.js",
	"./en-gb.js": "../../../../moment/locale/en-gb.js",
	"./en-ie": "../../../../moment/locale/en-ie.js",
	"./en-ie.js": "../../../../moment/locale/en-ie.js",
	"./en-nz": "../../../../moment/locale/en-nz.js",
	"./en-nz.js": "../../../../moment/locale/en-nz.js",
	"./eo": "../../../../moment/locale/eo.js",
	"./eo.js": "../../../../moment/locale/eo.js",
	"./es": "../../../../moment/locale/es.js",
	"./es-do": "../../../../moment/locale/es-do.js",
	"./es-do.js": "../../../../moment/locale/es-do.js",
	"./es-us": "../../../../moment/locale/es-us.js",
	"./es-us.js": "../../../../moment/locale/es-us.js",
	"./es.js": "../../../../moment/locale/es.js",
	"./et": "../../../../moment/locale/et.js",
	"./et.js": "../../../../moment/locale/et.js",
	"./eu": "../../../../moment/locale/eu.js",
	"./eu.js": "../../../../moment/locale/eu.js",
	"./fa": "../../../../moment/locale/fa.js",
	"./fa.js": "../../../../moment/locale/fa.js",
	"./fi": "../../../../moment/locale/fi.js",
	"./fi.js": "../../../../moment/locale/fi.js",
	"./fo": "../../../../moment/locale/fo.js",
	"./fo.js": "../../../../moment/locale/fo.js",
	"./fr": "../../../../moment/locale/fr.js",
	"./fr-ca": "../../../../moment/locale/fr-ca.js",
	"./fr-ca.js": "../../../../moment/locale/fr-ca.js",
	"./fr-ch": "../../../../moment/locale/fr-ch.js",
	"./fr-ch.js": "../../../../moment/locale/fr-ch.js",
	"./fr.js": "../../../../moment/locale/fr.js",
	"./fy": "../../../../moment/locale/fy.js",
	"./fy.js": "../../../../moment/locale/fy.js",
	"./gd": "../../../../moment/locale/gd.js",
	"./gd.js": "../../../../moment/locale/gd.js",
	"./gl": "../../../../moment/locale/gl.js",
	"./gl.js": "../../../../moment/locale/gl.js",
	"./gom-latn": "../../../../moment/locale/gom-latn.js",
	"./gom-latn.js": "../../../../moment/locale/gom-latn.js",
	"./gu": "../../../../moment/locale/gu.js",
	"./gu.js": "../../../../moment/locale/gu.js",
	"./he": "../../../../moment/locale/he.js",
	"./he.js": "../../../../moment/locale/he.js",
	"./hi": "../../../../moment/locale/hi.js",
	"./hi.js": "../../../../moment/locale/hi.js",
	"./hr": "../../../../moment/locale/hr.js",
	"./hr.js": "../../../../moment/locale/hr.js",
	"./hu": "../../../../moment/locale/hu.js",
	"./hu.js": "../../../../moment/locale/hu.js",
	"./hy-am": "../../../../moment/locale/hy-am.js",
	"./hy-am.js": "../../../../moment/locale/hy-am.js",
	"./id": "../../../../moment/locale/id.js",
	"./id.js": "../../../../moment/locale/id.js",
	"./is": "../../../../moment/locale/is.js",
	"./is.js": "../../../../moment/locale/is.js",
	"./it": "../../../../moment/locale/it.js",
	"./it.js": "../../../../moment/locale/it.js",
	"./ja": "../../../../moment/locale/ja.js",
	"./ja.js": "../../../../moment/locale/ja.js",
	"./jv": "../../../../moment/locale/jv.js",
	"./jv.js": "../../../../moment/locale/jv.js",
	"./ka": "../../../../moment/locale/ka.js",
	"./ka.js": "../../../../moment/locale/ka.js",
	"./kk": "../../../../moment/locale/kk.js",
	"./kk.js": "../../../../moment/locale/kk.js",
	"./km": "../../../../moment/locale/km.js",
	"./km.js": "../../../../moment/locale/km.js",
	"./kn": "../../../../moment/locale/kn.js",
	"./kn.js": "../../../../moment/locale/kn.js",
	"./ko": "../../../../moment/locale/ko.js",
	"./ko.js": "../../../../moment/locale/ko.js",
	"./ky": "../../../../moment/locale/ky.js",
	"./ky.js": "../../../../moment/locale/ky.js",
	"./lb": "../../../../moment/locale/lb.js",
	"./lb.js": "../../../../moment/locale/lb.js",
	"./lo": "../../../../moment/locale/lo.js",
	"./lo.js": "../../../../moment/locale/lo.js",
	"./lt": "../../../../moment/locale/lt.js",
	"./lt.js": "../../../../moment/locale/lt.js",
	"./lv": "../../../../moment/locale/lv.js",
	"./lv.js": "../../../../moment/locale/lv.js",
	"./me": "../../../../moment/locale/me.js",
	"./me.js": "../../../../moment/locale/me.js",
	"./mi": "../../../../moment/locale/mi.js",
	"./mi.js": "../../../../moment/locale/mi.js",
	"./mk": "../../../../moment/locale/mk.js",
	"./mk.js": "../../../../moment/locale/mk.js",
	"./ml": "../../../../moment/locale/ml.js",
	"./ml.js": "../../../../moment/locale/ml.js",
	"./mr": "../../../../moment/locale/mr.js",
	"./mr.js": "../../../../moment/locale/mr.js",
	"./ms": "../../../../moment/locale/ms.js",
	"./ms-my": "../../../../moment/locale/ms-my.js",
	"./ms-my.js": "../../../../moment/locale/ms-my.js",
	"./ms.js": "../../../../moment/locale/ms.js",
	"./mt": "../../../../moment/locale/mt.js",
	"./mt.js": "../../../../moment/locale/mt.js",
	"./my": "../../../../moment/locale/my.js",
	"./my.js": "../../../../moment/locale/my.js",
	"./nb": "../../../../moment/locale/nb.js",
	"./nb.js": "../../../../moment/locale/nb.js",
	"./ne": "../../../../moment/locale/ne.js",
	"./ne.js": "../../../../moment/locale/ne.js",
	"./nl": "../../../../moment/locale/nl.js",
	"./nl-be": "../../../../moment/locale/nl-be.js",
	"./nl-be.js": "../../../../moment/locale/nl-be.js",
	"./nl.js": "../../../../moment/locale/nl.js",
	"./nn": "../../../../moment/locale/nn.js",
	"./nn.js": "../../../../moment/locale/nn.js",
	"./pa-in": "../../../../moment/locale/pa-in.js",
	"./pa-in.js": "../../../../moment/locale/pa-in.js",
	"./pl": "../../../../moment/locale/pl.js",
	"./pl.js": "../../../../moment/locale/pl.js",
	"./pt": "../../../../moment/locale/pt.js",
	"./pt-br": "../../../../moment/locale/pt-br.js",
	"./pt-br.js": "../../../../moment/locale/pt-br.js",
	"./pt.js": "../../../../moment/locale/pt.js",
	"./ro": "../../../../moment/locale/ro.js",
	"./ro.js": "../../../../moment/locale/ro.js",
	"./ru": "../../../../moment/locale/ru.js",
	"./ru.js": "../../../../moment/locale/ru.js",
	"./sd": "../../../../moment/locale/sd.js",
	"./sd.js": "../../../../moment/locale/sd.js",
	"./se": "../../../../moment/locale/se.js",
	"./se.js": "../../../../moment/locale/se.js",
	"./si": "../../../../moment/locale/si.js",
	"./si.js": "../../../../moment/locale/si.js",
	"./sk": "../../../../moment/locale/sk.js",
	"./sk.js": "../../../../moment/locale/sk.js",
	"./sl": "../../../../moment/locale/sl.js",
	"./sl.js": "../../../../moment/locale/sl.js",
	"./sq": "../../../../moment/locale/sq.js",
	"./sq.js": "../../../../moment/locale/sq.js",
	"./sr": "../../../../moment/locale/sr.js",
	"./sr-cyrl": "../../../../moment/locale/sr-cyrl.js",
	"./sr-cyrl.js": "../../../../moment/locale/sr-cyrl.js",
	"./sr.js": "../../../../moment/locale/sr.js",
	"./ss": "../../../../moment/locale/ss.js",
	"./ss.js": "../../../../moment/locale/ss.js",
	"./sv": "../../../../moment/locale/sv.js",
	"./sv.js": "../../../../moment/locale/sv.js",
	"./sw": "../../../../moment/locale/sw.js",
	"./sw.js": "../../../../moment/locale/sw.js",
	"./ta": "../../../../moment/locale/ta.js",
	"./ta.js": "../../../../moment/locale/ta.js",
	"./te": "../../../../moment/locale/te.js",
	"./te.js": "../../../../moment/locale/te.js",
	"./tet": "../../../../moment/locale/tet.js",
	"./tet.js": "../../../../moment/locale/tet.js",
	"./th": "../../../../moment/locale/th.js",
	"./th.js": "../../../../moment/locale/th.js",
	"./tl-ph": "../../../../moment/locale/tl-ph.js",
	"./tl-ph.js": "../../../../moment/locale/tl-ph.js",
	"./tlh": "../../../../moment/locale/tlh.js",
	"./tlh.js": "../../../../moment/locale/tlh.js",
	"./tr": "../../../../moment/locale/tr.js",
	"./tr.js": "../../../../moment/locale/tr.js",
	"./tzl": "../../../../moment/locale/tzl.js",
	"./tzl.js": "../../../../moment/locale/tzl.js",
	"./tzm": "../../../../moment/locale/tzm.js",
	"./tzm-latn": "../../../../moment/locale/tzm-latn.js",
	"./tzm-latn.js": "../../../../moment/locale/tzm-latn.js",
	"./tzm.js": "../../../../moment/locale/tzm.js",
	"./uk": "../../../../moment/locale/uk.js",
	"./uk.js": "../../../../moment/locale/uk.js",
	"./ur": "../../../../moment/locale/ur.js",
	"./ur.js": "../../../../moment/locale/ur.js",
	"./uz": "../../../../moment/locale/uz.js",
	"./uz-latn": "../../../../moment/locale/uz-latn.js",
	"./uz-latn.js": "../../../../moment/locale/uz-latn.js",
	"./uz.js": "../../../../moment/locale/uz.js",
	"./vi": "../../../../moment/locale/vi.js",
	"./vi.js": "../../../../moment/locale/vi.js",
	"./x-pseudo": "../../../../moment/locale/x-pseudo.js",
	"./x-pseudo.js": "../../../../moment/locale/x-pseudo.js",
	"./yo": "../../../../moment/locale/yo.js",
	"./yo.js": "../../../../moment/locale/yo.js",
	"./zh-cn": "../../../../moment/locale/zh-cn.js",
	"./zh-cn.js": "../../../../moment/locale/zh-cn.js",
	"./zh-hk": "../../../../moment/locale/zh-hk.js",
	"./zh-hk.js": "../../../../moment/locale/zh-hk.js",
	"./zh-tw": "../../../../moment/locale/zh-tw.js",
	"./zh-tw.js": "../../../../moment/locale/zh-tw.js"
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "../../../../moment/locale recursive ^\\.\\/.*$";

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("../../../../../src/main.ts");


/***/ }),

/***/ 1:
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map