import { useState, useEffect } from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { fetchCarsData } from "../../../actions";
import { useHttp } from "../../../hooks/http.hook";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import {
  brandFilter,
  modelFilter,
  yearFilter,
  bodyFilter,
  transmissionFilter,
  fuelFilter,
  driveTrainFilter,
  colorFilter,
  passengersFilter,
  priceFilter,
  onFilterReset,
  onPaginationChange,
  locationFilter,
} from "../../../actions";

import "./carFilter.scss";

const FullCarFilter = () => {
  const filterData = createSelector(
    (state) => state.filters,
    (state) => state.data.data,

    (filters, data) => {
      return {
        filters: filters,
        data,
      };
    }
  );

  const dispatch = useDispatch();
  const { request } = useHttp();
  useEffect(() => {
    dispatch(fetchCarsData(request));
    // eslint-disable-next-line
  }, []);
  const { filters, data } = useSelector(filterData);

  const uniqueValue = (value) => {
    return Array.from(new Set(data.map((item) => item[value]))).sort();
  };

  const setData = uniqueValue;

  const models = data
    .filter((item) => item.brand === filters.brand)
    .map((item) => {
      return item.model;
    }).sort();

  const years = Array.from(new Set(data.map((item) => item.year + "")));

  return (
    <div className="filters">
      <h2>Filters</h2>

      <div className="filters-brand">
        <RadioSelect
          brands={setData("brand")}
          value={filters.brand}
          label="Brand"
        />
      </div>
      <div className="filters-model">
        <CheckBoxSelect
          data={Array.from(new Set(models))}
          setData={(_, v) => {
            dispatch(modelFilter(v));
            dispatch(onPaginationChange(10));
          }}
          label="Model"
          action="model"
          filters={filters}
        />
      </div>
      <div className="filters-year">
        <CheckBoxSelect
          data={years}
          setData={(_, v) => {
            dispatch(onPaginationChange(10));
            dispatch(yearFilter(v));
          }}
          label="Year"
          action="year"
          filters={filters}
        />
      </div>
      <div className="filters-bodyType">
        <CheckBoxSelect
          data={setData("body")}
          setData={(_, v) => {
            dispatch(bodyFilter(v));
            dispatch(onPaginationChange(10));
          }}
          label="Body Type"
          action="bodyType"
          filters={filters}
        />
      </div>
      <div className="filters-transmission">
        <CheckBoxSelect
          data={setData("transmission")}
          setData={(_, v) => {
            dispatch(transmissionFilter(v));
            dispatch(onPaginationChange(10));
          }}
          label="Transmission"
          action="transmission"
          filters={filters}
        />
      </div>
      <div className="filters-fuel">
        <CheckBoxSelect
          data={setData("engine")}
          setData={(_, v) => {
            dispatch(fuelFilter(v));
            dispatch(onPaginationChange(10));
          }}
          label="Fuel Type"
          action="fuelType"
          filters={filters}
        />
      </div>
      <div className="filters-driveTrain">
        <CheckBoxSelect
          data={setData("driveUnit")}
          setData={(_, v) => {
            dispatch(driveTrainFilter(v));
            dispatch(onPaginationChange(10));
          }}
          label="Drivetrain"
          action="driveTrain"
          filters={filters}
        />
      </div>
      <div className="filters-pax">
        <CheckBoxSelect
          data={setData("seats")}
          setData={(_, v) => {
            dispatch(passengersFilter(v));
            dispatch(onPaginationChange(10));
          }}
          label="Passengers"
          action="passengers"
          filters={filters}
        />
      </div>
      <div className="filters-color">
        <CheckBoxSelect
          data={setData("color")}
          setData={(_, v) => {
            dispatch(colorFilter(v));
            dispatch(onPaginationChange(10));
          }}
          label="Color"
          action="color"
          filters={filters}
        />
      </div>
      <div className="filters-color">
        <CheckBoxSelect
          data={setData("location")}
          setData={(_, v) => {
            dispatch(locationFilter(v));
            dispatch(onPaginationChange(10));
          }}
          label="Location"
          action="location"
          filters={filters}
        />
      </div>
      <div className="filters-priceRange">
        <PriceRange price={filters.price} />
      </div>

      <button
        onClick={(e) => dispatch(onFilterReset(e))}
        className="filters-reset"
      >
        Reset Filter
      </button>
    </div>
  );
};

const CheckBoxSelect = ({ data, label, setData, filters, action }) => {
  const diss = data.length === 0 ? true : false;
  const labels = data.map((item) => ({ title: item }));

  const s = !Array.isArray(filters?.[action])
    ? []
    : labels.filter((a) => filters?.[action].some((b) => a.title === b.title));

  return (
    <Autocomplete
      multiple
      disabled={diss}
      value={s}
      id="check-box-select"
      options={labels}
      disableCloseOnSelect
      limitTags={2}
      defaultValue={s}
      onChange={setData}
      getOptionLabel={(option) => option.title}
      isOptionEqualToValue={(option, value) => option.title === value.title}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox style={{ marginRight: 8 }} checked={selected} />
          {option.title}
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={label} />
      )}
    />
  );
};

const RadioSelect = ({ brands, value, label }) => {
  const dispatch = useDispatch();
  return (
    <Autocomplete
      disablePortal
      id="brand-select"
      value={value}
      options={brands}
      onChange={(e, v) => {
        dispatch(brandFilter(v));
        dispatch(modelFilter(""));
        dispatch(onPaginationChange(10));
      }}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
};

const PriceRange = ({ price }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    setPriceRange(price);
    dispatch(onPaginationChange(10));
  }, [price, dispatch]);
  const [priceRange, setPriceRange] = useState(price);

  const handleChangePrice = (_, newValue) => {
    setPriceRange(newValue);
  };

  return (
    <Box>
      <div>
        <span>Price Range</span>
        <div>
          <span>${priceRange[0]}</span>-<span>${priceRange[1]}</span>
        </div>
      </div>
      <Slider
        value={priceRange}
        min={0}
        max={300000}
        onChange={handleChangePrice}
        onMouseUp={() => dispatch(priceFilter(priceRange))}
        valueLabelDisplay="auto"
      />
    </Box>
  );
};

export default FullCarFilter;
