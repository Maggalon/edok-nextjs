import {
    ChangeEvent,
    FC,
    useCallback,
    useEffect,
    useState,
    useRef
  } from "react";
  import classnames from "classnames";
  //import "./multiRangeSlider.css";
  
  interface MultiRangeSliderProps {
    min: number;
    max: number;
    onChange: Function;
  }
  
  const MultiRangeSlider: FC<MultiRangeSliderProps> = ({
    min,
    max,
    onChange
  }) => {
    const [minVal, setMinVal] = useState(min);
    const [maxVal, setMaxVal] = useState(max);
    const minValRef = useRef<HTMLInputElement>(null);
    const maxValRef = useRef<HTMLInputElement>(null);
    const range = useRef<HTMLDivElement>(null);
  
    // Convert to percentage
    const getPercent = useCallback(
      (value: number) => Math.round(((value - min) / (max - min)) * 100),
      [min, max]
    );
  
    // Set width of the range to decrease from the left side
    useEffect(() => {
      if (maxValRef.current) {
        const minPercent = getPercent(minVal);
        const maxPercent = getPercent(+maxValRef.current.value); // Precede with '+' to convert the value from type string to type number
  
        if (range.current) {
          range.current.style.left = `${minPercent}%`;
          range.current.style.width = `${maxPercent - minPercent}%`;
        }
      }
    }, [minVal, getPercent]);
  
    // Set width of the range to decrease from the right side
    useEffect(() => {
      if (minValRef.current) {
        const minPercent = getPercent(+minValRef.current.value);
        const maxPercent = getPercent(maxVal);
  
        if (range.current) {
          range.current.style.width = `${maxPercent - minPercent}%`;
        }
      }
    }, [maxVal, getPercent]);
  
    // Get min and max values when their state changes
    useEffect(() => {
      onChange({ min: minVal, max: maxVal });
    }, [minVal, maxVal]);
  
    return (
      <div className="flex justify-center items-center m-10">
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          ref={minValRef}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const value = Math.min(+event.target.value, maxVal - 1);
            setMinVal(value);
            event.target.value = value.toString();
          }}
          className={classnames("thumb w-[200px] sm:w-[400px] thumb--zindex-3", {
            "thumb--zindex-5": minVal > max - 100
          })}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          ref={maxValRef}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const value = Math.max(+event.target.value, minVal + 1);
            setMaxVal(value);
            event.target.value = value.toString();
          }}
          className="thumb w-[200px] sm:w-[400px] thumb--zindex-4"
        />
  
        <div className="relative w-[200px] sm:w-[400px]">
          <div className="slider__track"></div>
          <div ref={range} className="slider__range"></div>
          <div className="slider__left-value">{minVal}:00</div>
          <div className="slider__right-value">{maxVal}:00</div>
        </div>
      </div>
    );
  };
  
  export default MultiRangeSlider;