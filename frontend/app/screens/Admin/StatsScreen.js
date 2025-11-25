import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Platform,
  Pressable,
} from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import axiosClient from "../../api/axiosClient";
import { AuthContext } from "../../context/AuthContext";
import stylesBase from "../../styles/statisticsStyle";

const screenWidth = Dimensions.get("window").width;

export default function StatisticsScreen() {
  const { user, initializing } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalPets: 0,
    totalRevenue: 0,
    totalServicesUsed: 0,
    totalServicesProvided: 0,
    appointmentsByMonth: { labels: [], values: [] },
    revenueByMonth: { labels: [], values: [] },
    serviceRatio: [],
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!initializing && user?.token) {
      loadStats();
    }
  }, [initializing, user?.token]);

  const loadStats = async () => {
    if (!user?.token) return;

    setLoading(true);
    setError(null);

    const config = { headers: { Authorization: `Bearer ${user.token}` } };

    const apis = [
      { key: "totalAppointments", url: "/api/admin/appointments/total" },
      { key: "appointmentsByMonth", url: "/api/admin/appointments/monthly" },
      { key: "servicesUsed", url: "/api/admin/services/total-used" },
      { key: "totalServicesProvided", url: "/api/admin/services" },
      { key: "totalPets", url: "/api/admin/pets" },
      { key: "revenueByMonth", url: "/api/admin/payments/monthly" },
    ];

    const responses = {};

    try {
      for (const api of apis) {
        try {
          const res = await axiosClient.get(api.url, config);
          responses[api.key] = res.data;
        } catch (err) {
          console.error(`❌ ${api.key} fetch failed:`, err.message);
          responses[api.key] = null;
        }
      }

      // Tổng lịch hẹn
      const totalAppointments =
        responses.totalAppointments?.totalAppointments || 0;

      // Tổng thú cưng
      const totalPets = Array.isArray(responses.totalPets)
        ? responses.totalPets.length
        : 0;

      // Tổng dịch vụ cung cấp
      const totalServicesProvided = Array.isArray(
        responses.totalServicesProvided
      )
        ? responses.totalServicesProvided.length
        : 0;

      // Dịch vụ đã sử dụng
      const servicesUsedArray = Array.isArray(responses.servicesUsed)
        ? responses.servicesUsed
        : Array.isArray(responses.servicesUsed?.servicesUsed)
        ? responses.servicesUsed.servicesUsed
        : [];
      const serviceRatio = servicesUsedArray.map((s, index) => ({
        name: s.name || "Unknown",
        value: s.totalUsed || 0,
        color: ["#FF6384", "#36A2EB", "#FFCE56", "#8BC34A", "#FF9800"][
          index % 5
        ],
      }));

      // Lịch hẹn theo tháng
      const appointmentsByMonthArray = Array.isArray(
        responses.appointmentsByMonth
      )
        ? responses.appointmentsByMonth
        : [];
      const appointmentsByMonth = {
        labels: appointmentsByMonthArray.map(
          (item) => `${item.month}/${item.year}`
        ),
        values: appointmentsByMonthArray.map(
          (item) => item.totalAppointments || 0
        ),
      };

      // Doanh thu theo tháng
      const revenueByMonthArray = Array.isArray(responses.revenueByMonth)
        ? responses.revenueByMonth
        : [];
      const revenueByMonth = {
        labels: revenueByMonthArray.map((item) => `${item.month}/${item.year}`),
        values: revenueByMonthArray.map((item) => item.revenue || 0),
      };
      const totalRevenue = revenueByMonth.values.reduce(
        (sum, val) => sum + val,
        0
      );

      setStats({
        totalAppointments,
        totalPets,
        totalRevenue,
        totalServicesUsed: serviceRatio.reduce((sum, s) => sum + s.value, 0),
        totalServicesProvided,
        appointmentsByMonth,
        revenueByMonth,
        serviceRatio,
      });
    } catch (err) {
      console.error("❌ Load stats general error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading || initializing || !user) {
    return (
      <View style={stylesBase.loadingContainer}>
        <ActivityIndicator size="large" color="#1a237e" />
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={stylesBase.container}
      showsVerticalScrollIndicator={false}
    >
      {error && (
        <View style={stylesBase.errorBox}>
          <Text style={stylesBase.errorText}>Lỗi khi tải dữ liệu: {error}</Text>
        </View>
      )}

      {/* SUMMARY CARDS */}
      <View style={stylesBase.cardRow}>
        <Pressable style={stylesBase.card}>
          <Text style={stylesBase.cardLabel}>Tổng lịch hẹn</Text>
          <Text style={stylesBase.cardValue}>{stats.totalAppointments}</Text>
        </Pressable>
        <Pressable style={stylesBase.card}>
          <Text style={stylesBase.cardLabel}>Tổng thú cưng</Text>
          <Text style={stylesBase.cardValue}>{stats.totalPets}</Text>
        </Pressable>
      </View>

      <View style={stylesBase.cardRow}>
        <Pressable style={stylesBase.card}>
          <Text style={stylesBase.cardLabel}>Tổng doanh thu</Text>
          <Text style={stylesBase.cardValue}>{stats.totalRevenue}k</Text>
        </Pressable>
        <Pressable style={stylesBase.card}>
          <Text style={stylesBase.cardLabel}>Dịch vụ cung cấp</Text>
          <Text style={stylesBase.cardValue}>
            {stats.totalServicesProvided}
          </Text>
        </Pressable>
      </View>

      {/* BAR CHART */}
      {stats.appointmentsByMonth.values.length > 0 && (
        <>
          <Text style={stylesBase.chartTitle}>Lịch hẹn theo tháng</Text>
          <BarChart
            data={{
              labels: stats.appointmentsByMonth.labels,
              datasets: [{ data: stats.appointmentsByMonth.values }],
            }}
            width={screenWidth - 20}
            height={220}
            chartConfig={stylesBase.chartConfig}
            style={stylesBase.chart}
          />
        </>
      )}

      {/* LINE CHART */}
      {stats.revenueByMonth.values.length > 0 && (
        <>
          <Text style={stylesBase.chartTitle}>Doanh thu theo tháng</Text>
          <LineChart
            data={{
              labels: stats.revenueByMonth.labels,
              datasets: [{ data: stats.revenueByMonth.values }],
            }}
            width={screenWidth - 20}
            height={240}
            chartConfig={stylesBase.chartConfig}
            style={stylesBase.chart}
          />
        </>
      )}

      {/* PIE CHART */}
      {stats.serviceRatio.length > 0 && (
        <>
          <Text style={stylesBase.chartTitle}>Tỷ lệ dịch vụ đã sử dụng</Text>
          <PieChart
            data={stats.serviceRatio.map((s) => ({
              name: s.name,
              population: s.value,
              color: s.color,
              legendFontColor: "#000",
              legendFontSize: 14,
            }))}
            width={screenWidth}
            height={240}
            chartConfig={stylesBase.chartConfig}
            accessor={"population"}
            paddingLeft={"15"}
          />
        </>
      )}
    </ScrollView>
  );
}
