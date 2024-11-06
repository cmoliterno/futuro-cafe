import React, {useMemo} from 'react';
import {useTheme} from '@react-navigation/native';
import {View, ScrollView, KeyboardAvoidingView, Text} from 'react-native';
import {Style, AnalyaticsStyle} from '../../styles';
import {useTranslation} from 'react-i18next';
import {Spacing} from '../../components';
import {SH, widthPercent} from '../../utils';
import {BarChart} from 'react-native-chart-kit';
const ViewSurveyReportScreen = props => {
  const {t} = useTranslation();
  const data = {
    labels: [
      t('Home_Title_23'),
      t('Home_Title_24'),
      t('Home_Title_25'),
      t('Home_Title_26'),
      t('Home_Title_27'),
    ],
    datasets: [
      {
        data: [45, 28, 80, 99, 43],
      },
    ],
  };
  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 7) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };
  const {Colors} = useTheme();
  const AnalyaticsStyles = useMemo(() => AnalyaticsStyle(Colors), [Colors]);
  return (
    <View style={Style.BgColorWhiteAll}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={Style.ScrollViewStyles}>
        <KeyboardAvoidingView enabled>
          <Spacing space={SH(20)} />
          <View style={AnalyaticsStyles.SetAllPadding}>
            <View style={AnalyaticsStyles.BarChartView}>
              <BarChart
                style={AnalyaticsStyles.Charts}
                data={data}
                width={widthPercent(80)}
                height={SH(250)}
                yAxisLabel=""
                chartConfig={chartConfig}
              />
            </View>
            <Spacing space={SH(20)} />
            <Text style={AnalyaticsStyles.SummaryText}>
              {t('Home_Title_29')}
            </Text>
            <Spacing space={SH(20)} />
            <View style={AnalyaticsStyles.TotalResponceView}>
              <View style={AnalyaticsStyles.TwoTextView}>
                <Text style={AnalyaticsStyles.TotalText}>
                  {t('Home_Title_30')}
                </Text>
                <Text style={AnalyaticsStyles.BlackTexytColor}>1178K</Text>
              </View>
              <View style={AnalyaticsStyles.TwoTextView}>
                <Text style={AnalyaticsStyles.TotalText}>
                  {t('Home_Title_31')}
                </Text>
                <Text style={AnalyaticsStyles.BlackTexytColor}>1177K</Text>
              </View>
              <View style={AnalyaticsStyles.TwoTextView}>
                <Text style={AnalyaticsStyles.TotalText}>
                  {t('Home_Title_32')}
                </Text>
                <Text style={AnalyaticsStyles.BlackTexytColor}>0</Text>
              </View>
            </View>
            <Spacing space={SH(40)} />
            <Text style={AnalyaticsStyles.SummaryText}>
              {t('Home_Title_33')}
            </Text>
            <Spacing space={SH(20)} />
            <View style={AnalyaticsStyles.TwoTextView}>
              <Text style={AnalyaticsStyles.TotalGrayTwo}>
                {t('Home_Title_34')}
              </Text>
              <Text style={AnalyaticsStyles.GreenColor}>
                {t('Home_Title_35')}
              </Text>
            </View>
            <View style={AnalyaticsStyles.TwoTextView}>
              <Text style={AnalyaticsStyles.TotalGrayTwo}>
                {t('Home_Title_36')}
              </Text>
              <Text style={AnalyaticsStyles.BlackTexytColor}>
                {t('Home_Title_37')}
              </Text>
            </View>
            <View style={AnalyaticsStyles.TwoTextView}>
              <Text style={AnalyaticsStyles.TotalGrayTwo}>
                {t('Home_Title_38')}
              </Text>
              <Text style={AnalyaticsStyles.BlackTexytColor}>
                {t('Home_Title_39')}
              </Text>
            </View>
            <View style={AnalyaticsStyles.TwoTextView}>
              <Text style={AnalyaticsStyles.TotalGrayTwo}>
                {t('Home_Title_40')}
              </Text>
              <Text style={AnalyaticsStyles.BlackTexytColor}>
                {t('Home_Title_41')}
              </Text>
            </View>
            <Spacing space={SH(40)} />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};
export default ViewSurveyReportScreen;
