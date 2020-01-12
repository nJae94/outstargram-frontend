import {useState} from "react";

export default (defaultValue) => {
    const [value, setValue] = useState(defaultValue);

    // 이벤트 발생 할때 마다 target에서 value값 가져와서 변경해줌
    // 키가 눌려서 값이 들어오면 이벤트가 발생하고 그 이벤트 target에서 value값을 가져와서 
    // setvalue하니까 value값이변경됨
    // useState를 활용한 커스텀 훅
    const onChange = (e) => {
        const {
            target: {value}
        } = e;

        setValue(value);
    };

    return {value, onChange};
}