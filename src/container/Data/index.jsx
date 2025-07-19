import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { useSelector } from 'react-redux';
import axios from '../utils/axios';

const Data = () => {
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const types = useSelector((state) => state.types.types);

  useEffect(() => {
    getChartData();
  }, []);

  const getChartData = async () => {
    try {
      const { data } = await axios({
        url: '/api/bill/data',
        params: {
          date: new Date().toISOString().split('T')[0],
        }
      });

      // 处理折线图数据
      const lineData = {
        labels: data.overview.map(item => item.date),
        datasets: [
          {
            data: data.overview.map(item => item.expense),
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
            strokeWidth: 2,
          },
        ],
      };
      setChartData(lineData);

      // 处理饼图数据
      const pieChartData = data.typeData.map((item, index) => ({
        name: item.type_name,
        population: item.number,
        color: `hsl(${index * 30}, 70%, 50%)`,
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      }));
      setPieData(pieChartData);
    } catch (error) {
      console.error('获取图表数据失败:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>数据统计</Text>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>支出趋势</Text>
        {chartData.labels && (
          <LineChart
            data={chartData}
            width={Dimensions.get('window').width - 32}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 127, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={styles.chart}
          />
        )}
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>支出分类</Text>
        {pieData.length > 0 && (
          <PieChart
            data={pieData}
            width={Dimensions.get('window').width - 32}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  chartContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default Data;
