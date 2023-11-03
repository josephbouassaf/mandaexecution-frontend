import { Flex, NumberInput, NumberInputField, Slider, SliderFilledTrack, SliderThumb, SliderTrack } from "@chakra-ui/react";
import { useState } from "react";

interface Props {
    maxValue:string; 
}
const NumberSlider = (props: Props) => {
    const {maxValue} = props; 
    const [value, setValue] = useState(Number(maxValue)); 
    const handleChange = (value:number) => setValue(value)
    return (
        <Flex>
      <Slider
        flex='1'
        focusThumbOnChange={false}
        value={value}
        onChange={handleChange}
        max={Number(maxValue)}
        step={10}
        min={0}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb fontSize='sm' children={value} />
      </Slider>
    </Flex>
    );
}

export default NumberSlider; 