
const app = Vue.createApp({
    data() {
        return {
            locationJson: undefined,
            currWeatherData: undefined,
            currDate: undefined,
            weatherVals: undefined,
            forecast: undefined,
            error:undefined,
            states: ['neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral'],
        };
    },

    created() {
        fetch("https://ipgeolocation.abstractapi.com/v1/?api_key=1354856482a94b5480ef1424889525d4")
            .then(val => val.json())
            .then(json => {
                this.locationJson = json;
                let lat = json.latitude;
                let long = json.longitude;
                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=imperial&appid=2ed114cac3597751ee93b01eff6101ef`)
                    .then(val => val.json())
                    .then(jsonVal => {
                        this.currWeatherData = jsonVal;
                        const rightNow = new Date();
                        this.currDate = rightNow.toLocaleString();
                        this.weatherVals = {
                            currTemp: jsonVal.main.temp,
                            highTemp: jsonVal.main.temp_max,
                            lowTemp: jsonVal.main.temp_min,
                            descr: jsonVal.weather[0].description,
                            humidity: jsonVal.main.humidity,
                            pressure: jsonVal.main.pressure,
                        }
                    })
                    .catch(anError => {
                        console.log(anError);
                        this.error = anError;
                    })
                fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=imperial&cnt&appid=2ed114cac3597751ee93b01eff6101ef`)
                    .then(thisVal => thisVal.json())
                    .then(theJson => {
                        this.forecast = theJson.list;
                    })
                    .catch(anError => {
                        console.log(anError);
                        this.error = anError;
                    })
            })
            .catch(anError => {
                console.log(anError);
                this.error = anError;
            })
    },


    methods: {
        // converting the unix UTC date to current
        localeString(weirdNum) {
            const date = new Date(weirdNum * 1000);
            return date.toLocaleString();
        },

        colorToggle(event) {

            // Get the index of this <div> from the DOM
            let idx = event.currentTarget.getAttribute('data-index');
            if (this.states[idx] === 'neutral') {
                this.states[idx] = 'likely';
            }
            else if (this.states[idx] === 'likely') {
                this.states[idx] = 'unlikely';
            }
            else if (this.states[idx] === 'unlikely') {
                this.states[idx] = 'neutral';
            }
            event.currentTarget.setAttribute('class', this.states[idx]);
        },

        getState(idx) {
            return this.states[idx];
        },

        deleteDiv(){
            this.error=undefined;
        }
    },

    computed: {
        likely() {
            let c = 0;
            for (let i in this.states){
                if (this.states[i] == "likely") {c++;}
            }
            return c;
        },

        unlikely() {
            let c = 0;
            for (let i in this.states){
                if (this.states[i] == "unlikely") {c++;}
            }
            return c;
        },

        neutral() {
            let c = 0;
            for (let i in this.states){
                if (this.states[i] == "neutral") {c++;}
            }
            return c;
        },
    },
});

const vm = app.mount('#app');
