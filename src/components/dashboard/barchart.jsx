/** @format */

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { api } from '../../configs/api.config';

const MONTHS = [
  { value: '2023-01', label: 'Jan' },
  { value: '2023-02', label: 'Feb' },
  { value: '2023-03', label: 'Mar' },
  { value: '2023-04', label: 'Apr' },
  { value: '2023-05', label: 'Mei' },
  { value: '2023-06', label: 'Jun' },
  { value: '2023-07', label: 'Jul' },
  { value: '2023-08', label: 'Ags' },
  { value: '2023-09', label: 'Sep' },
  { value: '2023-10', label: 'Okt' },
  { value: '2023-11', label: 'Nov' },
  { value: '2023-12', label: 'Des' },
];

const monthLabel = (value) => MONTHS.find((month) => month.value === value)?.label || value;

const buildChartData = (orders, month) => {
  if (!month) {
    const counts = Object.fromEntries(MONTHS.map((item) => [item.value, 0]));
    orders.forEach((order) => {
      const key = order.start_rent?.slice(0, 7);
      if (key && Object.prototype.hasOwnProperty.call(counts, key)) {
        counts[key] += 1;
      }
    });
    return MONTHS.map((item) => ({ label: item.label, value: counts[item.value] }));
  }

  const [year, monthNumber] = month.split('-').map(Number);
  const days = new Date(year, monthNumber, 0).getDate();
  const counts = {};
  orders.forEach((order) => {
    const day = order.start_rent?.slice(0, 10);
    if (day?.startsWith(month)) {
      counts[day] = (counts[day] || 0) + 1;
    }
  });

  return Array.from({ length: days }, (_, index) => {
    const day = String(index + 1).padStart(2, '0');
    return { label: String(index + 1), value: counts[`${month}-${day}`] || 0 };
  });
};

function BarChart() {
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const xAxisRef = useRef(null);
  const [orders, setOrders] = useState([]);
  const [month, setMonth] = useState('');

  const chartData = useMemo(() => buildChartData(orders, month), [orders, month]);

  useEffect(() => {
    api
      .get('/api/v1/orders')
      .then((response) => {
        setOrders(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useLayoutEffect(() => {
    const root = am5.Root.new(chartRef.current);
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        paddingLeft: 0,
        paddingRight: 16,
      })
    );

    const xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 20 });
    xRenderer.labels.template.setAll({ fontSize: 12, fill: am5.color(0x151515) });
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'label',
        renderer: xRenderer,
      })
    );

    const yRenderer = am5xy.AxisRendererY.new(root, {});
    yRenderer.labels.template.setAll({ fontSize: 12, fill: am5.color(0x151515) });
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        maxPrecision: 0,
        extraMax: 0.25,
        renderer: yRenderer,
      })
    );

    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: 'Sewa',
        xAxis,
        yAxis,
        valueYField: 'value',
        categoryXField: 'label',
        tooltip: am5.Tooltip.new(root, {
          labelText: '{categoryX}: {valueY} sewa',
        }),
      })
    );

    series.columns.template.setAll({
      cornerRadiusTL: 4,
      cornerRadiusTR: 4,
      strokeOpacity: 0,
      fill: am5.color(0x0d28a6),
      width: am5.percent(55),
    });

    chart.set('cursor', am5xy.XYCursor.new(root, { behavior: 'none' }));
    seriesRef.current = series;
    xAxisRef.current = xAxis;

    return () => {
      root.dispose();
      seriesRef.current = null;
      xAxisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!seriesRef.current || !xAxisRef.current) return;
    xAxisRef.current.data.setAll(chartData);
    seriesRef.current.data.setAll(chartData);
  }, [chartData]);

  return (
    <div className="bg-white p-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="fw-semibold">Jumlah sewa {month ? monthLabel(month) : ''} 2023</span>
        <select className="form-select" style={{ width: '15rem' }} value={month} onChange={(event) => setMonth(event.target.value)} aria-label="Pilih bulan">
          <option value="">Semua bulan</option>
          {MONTHS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label} - 2023
            </option>
          ))}
        </select>
      </div>
      <div ref={chartRef} style={{ width: '100%', height: '320px' }} />
    </div>
  );
}

export default BarChart;
