import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { Sidebar } from "../components/Sidebar";
import { theme } from "../styles/theme";
import Head from "next/head";
import { Header } from "../components/Header";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const options: ApexOptions = {
  chart: {
    toolbar: { show: false },
    zoom: { enabled: false },
    foreColor: theme.colors.gray[500],
  },
  grid: { show: false },
  dataLabels: { enabled: false },
  tooltip: { enabled: false },
  xaxis: {
    type: "datetime",
    axisBorder: { color: theme.colors.gray[600] },
    axisTicks: { color: theme.colors.gray[600] },
    categories: [
      "2021-04-12T00:00:00.000Z",
      "2021-04-13T00:00:00.000Z",
      "2021-04-14T00:00:00.000Z",
      "2021-04-15T00:00:00.000Z",
      "2021-04-16T00:00:00.000Z",
      "2021-04-17T00:00:00.000Z",
      "2021-04-18T00:00:00.000Z",
    ],
  },
  fill: {
    opacity: 0.3,
    type: "gradient",
    gradient: {
      shade: "dark",
      opacityFrom: 0.7,
      opacityTo: 0.3,
    },
  },
} as const;

const series = [{ name: "series1", data: [31, 120, 10, 28, 61, 180, 109] }];

export default function Dashboard() {
  return (
    <Flex direction="column" h="100vh">
      <Head>
        <title>dashgo.</title>
      </Head>
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />
        <SimpleGrid
          flex="1"
          gap="4"
          minChildWidth="320px"
          alignItems="flex-start"
        >
          <Box p={["6", "8"]} bg="gray.800" borderRadius={8}>
            <Text fontSize="lg" mb="4">
              Inscritos da Semana
            </Text>
            <Chart options={options} series={series} type="area" height={160} />
          </Box>
          <Box p={["6", "8"]} bg="gray.800" borderRadius={8}>
            <Text fontSize="lg" mb="4">
              Taxa de Abertura
            </Text>

            <Chart options={options} series={series} type="area" height={160} />
          </Box>
        </SimpleGrid>
      </Flex>
    </Flex>
  );
}
