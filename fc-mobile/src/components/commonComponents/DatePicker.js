import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment';
import VectorIcon from './VectoreIcons';
import { Colors, SF } from '../../utils';
import { ProfileTabStyles, Style } from '../../styles';
import { useTheme } from 'react-native-elements';

function DatePicker(props) {
  const [dateselcet, setdateselcet] = useState('10-12-2023');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDateTimePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDateTimePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDatePicked = (date) => {
    setdateselcet(moment(date, "YYYY-MM-DDTHH:mm:ss Z").local().format('DD-MM-YYYY'));
    hideDateTimePicker();
  };

  return (
    <View>
      <TouchableOpacity onPress={showDateTimePicker} style={Style.inputBox}>
        <Text style={Style.DateTextStyle}>{dateselcet}</Text>
        <VectorIcon style={Style.editiconStyle} size={SF(20)} icon="AntDesign" name="calendar" />
      </TouchableOpacity>
      <DateTimePicker
        isVisible={isDatePickerVisible}
        mode="date"  // Certifique-se de definir o modo como "date"
        onConfirm={handleDatePicked}
        onCancel={hideDateTimePicker}
      />
    </View>
  )
}

export default DatePicker;
