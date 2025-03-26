import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
function App() {
  // ========================== //
  const [selectedCity, setSelectedCity] = useState({
    cityApiName: "",
    cityArName: "",
    cityDate: "",
  });

  const [cityPrayerTimes, setcityPrayerTimes] = useState({
    fajr: "4:30",
    sunrise: "5:26",
    dhurh: "11:30",
    asr: "14:56",
    sunset: "17:33",
    isha: "19:03",
  });
  let cities = [
    { arabicName: "دمشق", name: "Dimashq" },
    { arabicName: "ريف دمشق", name: "Rīf Dimashq" },
    { arabicName: "السويداء", name: "As Suwaydā'" },
    { arabicName: "اللاذقية", name: "Al Lādhiqīyah" },
    { arabicName: "طرطوس", name: "Ţarţūs" },
    { arabicName: "حمص", name: "Ḩimş" },
    { arabicName: "حماة", name: "Ḩamāh" },
    { arabicName: "حلب", name: "Ḩalab" },
    { arabicName: "القنيطرة", name: "Al Qunayţirah" },
    { arabicName: "الحسكة", name: "Al Ḩasakah" },
    { arabicName: "الرقة", name: "Ar Raqqah" },
    { arabicName: "درعا", name: "Dar'ā" },
    { arabicName: "دير الزرو", name: "Dayr az Zawr" },
    { arabicName: "أدلب", name: "Idlib" },
  ];

  let citiesList = useMemo(() => {
    return cities.map((city) => {
      return (
        <option value={city.name} key={city.name} className="bg-white">
          {city.arabicName}
        </option>
      );
    });
  }, []);

  function handleCityChange(apiName) {
    const myCity = cities.find((c) => c.name === apiName);
    if (myCity) {
      setSelectedCity((pervCity) => {
        return {
          ...pervCity,
          cityArName: myCity.arabicName,
          cityApiName: apiName,
        };
      });
    }

    getPrayersTimingByCity(apiName);
  }

  function getPrayersTimingByCity(apiName) {
    console.log("pra");
    let params = {
      country: "SY",
      city: apiName,
    };
    axios
      .get("https://api.aladhan.com/v1/timingsByCity", {
        params: params,
      })
      .then(function (response) {
        const timings = response.data.data.timings;
        const readableDate = response.data.data.date.readable;
        // const weekDay = response.data.data.date.hijri.weekday.ar;

        let newCityDate = readableDate;
        setSelectedCity((pervCity) => {
          return {
            ...pervCity,
            cityDate: newCityDate,
          };
        });

        setcityPrayerTimes({
          ...prayerTimes,
          fajr: timings.Fajr,
          sunrise: timings.Sunrise,
          dhurh: timings.Dhuhr,
          asr: timings.Asr,
          sunset: timings.Sunset,
          isha: timings.Isha,
        });
        // fillTimeForPrayer("fajr-time", timings.Fajr);
        // fillTimeForPrayer("sunrise-time", timings.Sunrise);
        // fillTimeForPrayer("dhurh-time", timings.Dhuhr);
        // fillTimeForPrayer("asr-time", timings.Asr);
        // fillTimeForPrayer("sunset-time", timings.Sunset);
        // fillTimeForPrayer("isha-time", timings.Isha);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  useEffect(() => {
    const defaultCity = cities[0].name;
    handleCityChange(defaultCity);
  }, []);
  // ========================== //
  const prayerTimes = [
    {
      id: "fajr",
      title: "الفجر",
      Time: cityPrayerTimes.fajr,
    },
    {
      id: "shoruq",
      title: "الشروق",
      Time: cityPrayerTimes.sunrise,
    },
    {
      id: "dhurh",
      title: "الظهر",
      Time: cityPrayerTimes.dhurh,
    },
    {
      id: "asr",
      title: "العصر",
      Time: cityPrayerTimes.asr,
    },
    {
      id: "sunset",
      title: "المغرب",
      Time: cityPrayerTimes.sunset,
    },
    {
      id: "isha",
      title: "العشاء",
      Time: cityPrayerTimes.isha,
    },
  ];
  let cardList = prayerTimes.map((el) => {
    return (
      <div
        key={el.id}
        className="card col-span-2 w-[100%] h-[300px] text-[20px] bg-white  shadow-[0px_10px_5px_rgba(0,0,0,0.3)] text-black"
      >
        <div className="header text-white">
          <h1 className=" p-2 text-[30px] font-bold">{el.title}</h1>
        </div>
        <div dir="rtl" className="body flex justify-center items-center ">
          <h1 className="time text-[40px]" id="fajr-time">
            {el.Time}
          </h1>
        </div>
      </div>
    );
  });
  return (
    <div className="App">
      <div className="mt-[100px] min-h-screen">
        <div>
          <div className="text-white mr-[40px] text-right font-bold">
            <h1 id="city-name" className="text-[100px]">
              {selectedCity.cityArName || "دمشق"}
            </h1>
            <h6
              id="today-date"
              className="text-[40px]"
              // style={{ fontSize: "40px" }}
            >
              {selectedCity.cityDate}
            </h6>
          </div>
          <hr className="my-[10px] mx-[50px] b-[#5200e1]" />
        </div>
        <div className="city-container">
          <select
            onChange={(event) => handleCityChange(event.target.value)}
            value={selectedCity.cityApiName}
            className="select-city w-[300px] h-[35px] text-[20px] bg-white text-black p-2 my-[20px]"
            style={{
              fontFamily: "Tajawal, serif",
              borderRadius: "20px",
            }}
          >
            {citiesList}
          </select>
        </div>
        <div
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
          }}
          className="card-container  grid  flex-wrap gap-3 px-2 mb-[20px] mt-[40px]"
        >
          {cardList}
        </div>
      </div>
      <footer className="bg-white text-black text-xl font-sans p-1">
        Created By Taim Jr
      </footer>
    </div>
  );
}

export default App;
