/** @format */

import { useLayoutEffect, useState, useEffect } from 'react';
import axios from 'axios';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';

function BarChart() {
  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [untilDate, setUntilDate] = useState('');

  const token = localStorage.getItem('TOKEN');

  const fetchData = (from, until) => {
    axios
      .get(
        `https://api-car-rental.binaracademy.org/admin/order/reports?from=${from}&until=${until}`,

        {
          headers: {
            access_token: `${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        const transformedData = response.data.map((item) => ({
          date: new Date(item.day).getTime(),
          value: item.orderCounte,
        }));
        setData(transformedData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    if (fromDate && untilDate) {
      fetchData(fromDate, untilDate);
    }
  }, [fromDate, untilDate]);

  useLayoutEffect(() => {
    let root = am5.Root.new('chartdiv');

    const myTheme = am5.Theme.new(root);

    myTheme.rule('AxisLabel', ['minor']).setAll({
      dy: 1,
    });

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: 'panX',
        wheelY: 'zoomX',
        paddingLeft: 0,
      })
    );

    let cursor = chart.set(
      'cursor',
      am5xy.XYCursor.new(root, {
        behavior: 'zoomX',
      })
    );
    cursor.lineY.set('visible', false);

    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        maxDeviation: 0,
        baseInterval: {
          timeUnit: 'month',
          count: 1,
        },
        markUnitChange: false,
        renderer: am5xy.AxisRendererX.new(root, {
          minorGridEnabled: true,
          minorLabelsEnabled: true,
        }),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    xAxis.set('minorDateFormats', {
      day: 'dd',
      month: 'MM',
    });

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    let series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: 'Series',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value',
        valueXField: 'date',
        tooltip: am5.Tooltip.new(root, {
          labelText: '{valueY}',
        }),
      })
    );

    series.columns.template.setAll({ strokeOpacity: 0 });

    chart.set(
      'scrollbarX',
      am5.Scrollbar.new(root, {
        orientation: 'horizontal',
      })
    );

    if (data.length > 0) {
      series.data.setAll(data);

      series.appear(1000);
      chart.appear(1000, 100);
    }

    return () => {
      root.dispose();
    };
  }, [data]);

  const handleFromChange = (event) => {
    const [year, month] = event.target.value.split('-');
    setFromDate(`${year}-${month}-01`);
    const lastDay = new Date(year, month, 0).getDate();
    setUntilDate(`${year}-${month}-${lastDay}`);
  };

  return (
    <div id="chartdiv" style={{ height: '350px' }}>
      <div>
        <select className="form-select" aria-label="Default select example" style={{ width: '15rem' }} onChange={handleFromChange}>
          <option value="2022-01" defaultValue>
            Jan - 2022
          </option>
          <option value="2022-02">Feb - 2022</option>
          <option value="2022-03">Mar - 2022</option>
          <option value="2022-04">Apr - 2022</option>
          <option value="2022-05">Mei - 2022</option>
          <option value="2022-06">Juni - 2022</option>
          <option value="2022-07">Juli - 2022</option>
          <option value="2022-08">Ags - 2022</option>
          <option value="2022-09">Sep - 2022</option>
          <option value="2022-10">Okt - 2022</option>
          <option value="2022-11">Nov - 2022</option>
          <option value="2022-12">Des - 2022</option>
        </select>
      </div>
    </div>
  );
}
export default BarChart;
