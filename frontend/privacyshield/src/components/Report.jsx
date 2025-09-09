import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "./ui/Navbar";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PieController,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PieController,
  ChartDataLabels
);

// Import jsPDF and html2canvas for PDF generation
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import SubscriptionModal from "./ui/SubscriptionModal";

const backend_url = import.meta.env.VITE_BACKEND_URI;

// Icon components
const ShieldIcon = () => (
  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const WarningIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

const XIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
      clipRule="evenodd"
    />
  </svg>
);

const BellIcon = () => (
  <svg
    className="w-5 h-5 mr-2"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 17h5l-3.5 3.5M9 19c.5-1.61 2.386-2.8 4-2.8s3.5 1.19 4 2.8M12 2C8.24 2 5 5.88 5 10.5V17l-2 2h16l-2-2v-6.5C17 5.88 13.76 2 12 2z"
    />
  </svg>
);

const RotateIcon = () => (
  <svg
    className="w-5 h-5 mr-2"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);

const HomeIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg
    className="w-5 h-5 transition-transform duration-200"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const LightBulbIcon = () => (
  <svg
    className="w-5 h-5 text-blue-500"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM6 10a1 1 0 01-1 1H4a1 1 0 110-2h1a1 1 0 011 1zM10 14a4 4 0 100-8 4 4 0 000 8zM8 16a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zM9 18a1 1 0 100 2h2a1 1 0 100-2H9z" />
  </svg>
);

const DownloadIcon = () => (
  <svg
    className="w-5 h-5 mr-2"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const TrendingUpIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    />
  </svg>
);

const PrivacyReport = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedMisconceptions, setExpandedMisconceptions] = useState({});
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
   const [isModalOpen, setIsModalOpen] = useState(false);

  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const pdfContentRef = useRef(null);

  // Function to toggle misconceptions expansion
  const toggleMisconceptions = (categoryTitle) => {
    setExpandedMisconceptions((prev) => ({
      ...prev,
      [categoryTitle]: !prev[categoryTitle],
    }));
  };

  // Function to calculate overall privacy score from API response
  const calculateOverallScore = (apiResponse) => {
    if (!apiResponse || Object.keys(apiResponse).length === 0) return 0;

    const scores = Object.values(apiResponse).map(
      (category) => category.scorePercentage
    );
    const avgScore =
      scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return Math.round(avgScore);
  };

  // Function to get short titles for chart display
  const getShortTitle = (title) => {
    const shortTitles = {
      "Digital Identity & Authentication": "Digital Identity",
      "Data Collection & Control": "Data Control",
      "Location & Physical Safety": "Location Safety",
      "Social & Reputation Management": "Social Reputation",
      "Surveillance & Tracking": "Surveillance",
      "Transparency & Corporate Trust": "Corporate Trust",
      "Legal & Advanced Privacy": "Legal Privacy",
    };
    return shortTitles[title] || title;
  };

  // Function to get risk level from score
  const getRiskLevel = (score) => {
    if (score >= 80) return "Low Risk";
    if (score >= 60) return "Moderate Risk";
    if (score >= 40) return "High Risk";
    return "Critical Risk";
  };

  // Function to fetch report data from API
  const fetchReportData = async (privacyScores) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(backend_url + "/assesment/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(privacyScores),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      console.log(apiResponse);

      // Transform API response to match our component structure
      const transformedCategories = Object.entries(apiResponse).map(
        ([categoryName, categoryData]) => ({
          title: categoryName,
          shortTitle: getShortTitle(categoryName),
          score: categoryData.scorePercentage,
          misconceptions: categoryData.misconceptions || [],
          recommendations: categoryData.suggestions.map((suggestion) => {
            // Handle different suggestion types based on the new API structure
            if (suggestion.type === "negative") {
              return {
                // text: suggestion.text,
                status: suggestion.type,
                tools: suggestion.categoryTools || [],
                methodology: suggestion.categoryMethodology || [],
              };
            } else {
              // For positive suggestions, put the text in methodology
              return {
                // text: "",
                status: suggestion.type,
                tools: suggestion.tools || [],
                methodology: [suggestion.text], // Put the text as methodology for positive suggestions
              };
            }
          }),
        })
      );

      // Calculate overall score
      const overallScore = calculateOverallScore(apiResponse);

      setReportData({
        score: overallScore,
        riskLevel: getRiskLevel(overallScore),
        categories: transformedCategories,
      });
    } catch (err) {
      console.error("Error fetching report data:", err);
      setError(err.message || "Failed to load privacy report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get privacy scores from navigation state
    const privacyScores = location.state?.scores;

    if (!privacyScores) {
      setError(
        "No assessment data found. Please complete the assessment first."
      );
      setLoading(false);
      return;
    }

    fetchReportData(privacyScores);
  }, [location.state]);

  const getRiskDetails = (score) => {
    if (score >= 80) {
      return {
        level: "Low Risk",
        color: "text-green-700",
        bgColor: "bg-green-50",
        borderColor: "border-green-300",
        icon: CheckIcon,
      };
    } else if (score >= 60) {
      return {
        level: "Moderate Risk",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        icon: WarningIcon,
      };
    } else if (score >= 40) {
      return {
        level: "High Risk",
        color: "text-red-700",
        bgColor: "bg-red-100",
        borderColor: "border-red-400",
        icon: XIcon,
      };
    } else {
      return {
        level: "Critical Risk",
        color: "text-red-800",
        bgColor: "bg-red-200",
        borderColor: "border-red-500",
        icon: XIcon,
      };
    }
  };

  const createPieChart = () => {
    const canvas = chartRef.current;
    if (!canvas || !reportData?.categories) return;

    const ctx = canvas.getContext("2d");

    // Destroy previous instance to avoid "already in use" error
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Calculate total score and percentages
    const totalScore = reportData.categories.reduce(
      (sum, cat) => sum + cat.score,
      0
    );
    const percentages = reportData.categories.map((cat) =>
      totalScore > 0 ? Math.round((cat.score / totalScore) * 100) : 0
    );

    // Define colors for each category
    const backgroundColor = [
      "rgba(255, 99, 132, 0.2)",
      "rgba(255, 159, 64, 0.2)",
      "rgba(255, 205, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(201, 203, 207, 0.2)",
    ];
    const borderColor = [
      "rgb(255, 99, 132)",
      "rgb(255, 159, 64)",
      "rgb(255, 205, 86)",
      "rgb(75, 192, 192)",
      "rgb(54, 162, 235)",
      "rgb(153, 102, 255)",
      "rgb(201, 203, 207)",
    ];

    chartInstance.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels: reportData.categories.map((cat) => cat.shortTitle),
        datasets: [
          {
            data: percentages,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: "right",
            labels: {
              padding: 15,
              usePointStyle: true,
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const categoryIndex = context.dataIndex;
                const actualScore = reportData.categories[categoryIndex].score;
                return (
                  context.label +
                  ": " +
                  context.parsed +
                  "% (Score: " +
                  actualScore +
                  ")"
                );
              },
            },
          },
          datalabels: {
            display: true,
            color: "#37277aff",
            font: {
              size: 16,
            },
            formatter: function (value, context) {
              return value + "%";
            },
            anchor: "center",
            align: "center",
          },
        },
      },
    });
  };

  useEffect(() => {
    createPieChart();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [reportData]);

  useEffect(() => {
    if (reportData) {
      window.scrollTo(0, 0);
    }
  }, [reportData]);

  const handleRetakeAssessment = () => {
    navigate("/assesment");
  };

  const handleBackToDashboard = () => {
    navigate("/");
  };

  // Enhanced PDF generation function (white theme)
  const handleDownloadPDF = async () => {
    if (!reportData || isGeneratingPDF) return;

    try {
      setIsGeneratingPDF(true);

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;
      let yPosition = 20;

      // Helper function to add page break if needed
      const checkPageBreak = (requiredHeight) => {
        if (yPosition + requiredHeight > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
      };

      // ===== HEADER =====
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text("Privacy Assessment Report", pageWidth / 2, 20, {
        align: "center",
      });

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        "Your comprehensive digital privacy analysis",
        pageWidth / 2,
        28,
        { align: "center" }
      );

      yPosition = 45;

      // ===== OVERALL SCORE =====
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text("Overall Score", margin, yPosition);
      yPosition += 12;

      // Score
      pdf.setTextColor(37, 99, 235);
      pdf.setFontSize(36);
      pdf.setFont("helvetica", "bold");
      pdf.text(`${reportData.score}/100`, margin + 40, yPosition);

      // Risk Level
      const riskDetails = getRiskDetails(reportData.score);
      let riskColor = [37, 99, 235]; // Default blue
      if (reportData.score >= 80) riskColor = [16, 185, 129]; // Green
      else if (reportData.score >= 60) riskColor = [245, 158, 11]; // Yellow
      else riskColor = [239, 68, 68]; // Red

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
      pdf.text(`Risk Level: ${riskDetails.level}`, margin, yPosition + 10);

      yPosition += 30;

      // ===== CHART =====
      checkPageBreak(80);
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "bold");
      pdf.text("Score Distribution by Category", margin, yPosition);
      yPosition += 10;

      const chartCanvas = chartRef.current;
      if (chartCanvas) {
        try {
          const chartImage = await html2canvas(chartCanvas, {
            backgroundColor: "#ffffff",
            scale: 1.5,
            width: chartCanvas.width,
            height: chartCanvas.height,
          });
          const chartImgData = chartImage.toDataURL("image/png");

          // Maintain aspect ratio
          const chartAspectRatio = chartCanvas.height / chartCanvas.width;
          let chartWidth = contentWidth;
          let chartHeight = chartWidth * chartAspectRatio;

          if (chartHeight > 60) {
            chartHeight = 60;
            chartWidth = chartHeight / chartAspectRatio;
          }

          const chartX = margin + (contentWidth - chartWidth) / 2;
          pdf.addImage(
            chartImgData,
            "PNG",
            chartX,
            yPosition,
            chartWidth,
            chartHeight
          );
          yPosition += chartHeight + 10;
        } catch (error) {
          console.warn("Could not capture chart:", error);
          yPosition += 70;
        }
      } else {
        yPosition += 70;
      }

      // ===== DETAILED CATEGORIES =====
      checkPageBreak(20);
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "bold");
      pdf.text("Detailed Category Analysis", margin, yPosition);
      yPosition += 12;

      reportData.categories.forEach((category, idx) => {
        checkPageBreak(30);

        // Category title with score
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(37, 99, 235);
        pdf.text(
          `${idx + 1}. ${category.title} (Score: ${category.score}/100)`,
          margin,
          yPosition
        );
        yPosition += 8;

        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(60, 60, 60);

        // Tools section
        const tools = category.recommendations
          .flatMap((rec) => rec.tools || [])
          .filter((tool) => tool && tool.trim() !== "")
          .slice(0, 3);

        if (tools.length > 0) {
          checkPageBreak(15);
          pdf.setFontSize(9);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(0, 0, 0);
          pdf.text("Tools:", margin + 5, yPosition);
          yPosition += 5;

          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(60, 60, 60);
          tools.forEach((tool) => {
            const lines = pdf.splitTextToSize(`• ${tool}`, contentWidth - 10);
            lines.forEach((line) => {
              checkPageBreak(5);
              pdf.text(line, margin + 8, yPosition);
              yPosition += 4;
            });
          });
          yPosition += 3;
        }

        // Methodologies section
        const negativeMethodologies = category.recommendations
          .filter((rec) => rec.status === "negative")
          .flatMap((rec) => rec.methodology || [])
          .filter((method) => method && method.trim() !== "");

        const positiveMethodologies = category.recommendations
          .filter((rec) => rec.status === "positive")
          .flatMap((rec) => rec.methodology || [])
          .filter((method) => method && method.trim() !== "");

        const orderedMethodologies = [
          ...negativeMethodologies,
          ...positiveMethodologies,
        ];

        if (orderedMethodologies.length > 0) {
          checkPageBreak(15);
          pdf.setFontSize(9);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(0, 0, 0);
          pdf.text("Methodology:", margin + 5, yPosition);
          yPosition += 5;

          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(60, 60, 60);
          orderedMethodologies.forEach((method) => {
            const lines = pdf.splitTextToSize(
              `• ${method.trim()}`,
              contentWidth - 10
            );
            lines.forEach((line) => {
              checkPageBreak(5);
              pdf.text(line, margin + 8, yPosition);
              yPosition += 4;
            });
            yPosition += 1;
          });
          yPosition += 3;
        }

        // Misconceptions section
        if (category.misconceptions && category.misconceptions.length > 0) {
          checkPageBreak(20);
          pdf.setFontSize(9);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(0, 0, 0);
          pdf.text("Privacy Insights & Common Myths:", margin + 5, yPosition);
          yPosition += 6;

          category.misconceptions.forEach((item, mIdx) => {
            checkPageBreak(25);

            // Myth
            pdf.setFontSize(9);
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(60, 60, 60);
            pdf.text(`Myth ${mIdx + 1}:`, margin + 8, yPosition);
            yPosition += 5;

            pdf.setFont("helvetica", "italic");
            pdf.setTextColor(60, 60, 60);
            const mythLines = pdf.splitTextToSize(
              `"${item.misconceptionText}"`,
              contentWidth - 15
            );
            mythLines.forEach((line) => {
              checkPageBreak(5);
              pdf.text(line, margin + 10, yPosition);
              yPosition += 4;
            });
            yPosition += 2;

            // Reality
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(60, 60, 60);
            pdf.text("Reality:", margin + 8, yPosition);
            yPosition += 5;

            pdf.setFont("helvetica", "normal");
            const realityLines = pdf.splitTextToSize(
              item.realityCheck,
              contentWidth - 15
            );
            realityLines.forEach((line) => {
              checkPageBreak(5);
              pdf.text(line, margin + 10, yPosition);
              yPosition += 4;
            });
            yPosition += 2;

            // Impact
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(60, 60, 60);
            pdf.text("Impact:", margin + 8, yPosition);
            yPosition += 5;

            pdf.setFont("helvetica", "normal");
            const impactLines = pdf.splitTextToSize(
              item.whyItMatters,
              contentWidth - 15
            );
            impactLines.forEach((line) => {
              checkPageBreak(5);
              pdf.text(line, margin + 10, yPosition);
              yPosition += 4;
            });
            yPosition += 6;
          });
        }

        yPosition += 8;
      });

      // ===== STAY UPDATED SECTION =====
      checkPageBreak(25);
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "bold");
      pdf.text("Stay Privacy-Protected", margin, yPosition);
      yPosition += 8;

      pdf.setTextColor(60, 60, 60);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      const stayUpdatedText =
        "Privacy threats evolve constantly. New data breaches, updated privacy policies, and emerging tracking technologies mean your privacy score can change. Regular reassessment ensures you stay ahead of new risks and maintain optimal protection.";
      const stayUpdatedLines = pdf.splitTextToSize(
        stayUpdatedText,
        contentWidth
      );
      stayUpdatedLines.forEach((line) => {
        checkPageBreak(5);
        pdf.text(line, margin, yPosition);
        yPosition += 4;
      });

      // ===== FOOTER =====
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(120, 120, 120);
        pdf.text(
          `Privacy Shield Assessment • Page ${i} of ${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: "center" }
        );
        pdf.text(
          `Generated: ${new Date().toLocaleDateString()}`,
          pageWidth - margin,
          pageHeight - 10,
          { align: "right" }
        );
      }

      pdf.save(
        `Privacy_Assessment_Report_${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSubscribeForUpdates = () => {
    // You can implement your subscription logic here
    // For now, this could open a modal, redirect to a subscription page, etc.
    alert(
      "Subscription feature coming soon! We'll notify you about privacy updates."
    );
    // Example: navigate("/subscribe") or open a modal
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-blue-700 text-lg">
              Loading privacy assessment...
            </p>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <h2 className="font-bold text-lg mb-2">Error Loading Report</h2>
              <p>{error}</p>
            </div>
            <button
              onClick={() => navigate("/assessment")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Assessment
            </button>
          </div>
        </div>
      </>
    );
  }

  // Don't render until data is loaded
  if (!reportData) {
    return null;
  }

  const riskDetails = getRiskDetails(reportData.score);
  const RiskIcon = riskDetails.icon;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto" ref={pdfContentRef}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <ShieldIcon />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-2">
              Privacy Assessment Report
            </h1>
            <p className="text-blue-700 text-lg">
              Your comprehensive digital privacy analysis
            </p>
          </div>

          {/* Large Score Display Card */}
          <div className="relative rounded-3xl shadow-2xl mb-8 overflow-hidden">
            {/* Glass Background */}
            <div className="absolute inset-0 backdrop-blur-sm"></div>
            <div className="absolute inset-0 bg-white/10 backdrop-blur-md"></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col p-8 sm:p-12">
              {/* Score + Risk on Left, Chart on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                {/* Left Column */}
                <div className="flex flex-col gap-6">
                  {/* Score Card */}
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-2xl">
                    <div className="text-center">
                      <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-blue-900">
                        Your Privacy Score
                      </h2>
                      <div className="text-5xl sm:text-6xl font-bold mb-2 text-blue-900">
                        {reportData.score}
                      </div>
                      <p className="text-blue-900 text-lg">out of 100</p>
                    </div>
                  </div>

                  {/* Risk Level Card */}
                  <div
                    className={`${riskDetails.bgColor} ${riskDetails.borderColor} border-l-4 rounded-xl p-6 shadow-2xl`}
                  >
                    <div className="flex items-center mb-4 gap-4">
                      <RiskIcon
                        className={`w-8 h-8 ${riskDetails.color} mr-3`}
                      />
                      <div>
                        <h3 className="text-xl font-bold text-blue-900">
                          Risk Assessment
                        </h3>
                        <p
                          className={`text-lg font-semibold ${riskDetails.color}`}
                        >
                          {riskDetails.level}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Chart */}
                <div className="w-full bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-2xl relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-white/5 to-transparent rounded-2xl"></div>
                  <div className="relative z-10 w-full aspect-[4/3] sm:aspect-[16/9]">
                    <canvas ref={chartRef} className="w-full h-full"></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personalized Recommendations */}
          <div className="mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-8 text-center">
              Personalized Recommendations
            </h3>

            <div className="space-y-6">
              {reportData.categories.map((category, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-md border border-blue-100 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    {/* Title and Content */}
                    <div className="flex-1 pr-4">
                      <h4 className="text-lg font-bold text-blue-900 mb-3">
                        {category.title}
                      </h4>

                      {/* Tools Section */}
                      <div className="mb-4">
                        <h5 className="font-semibold text-blue-700 mb-2">
                          Tools:
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {(() => {
                            // Group tools by recommendation (category)
                            const toolsByRecommendation =
                              category.recommendations
                                .map((rec) =>
                                  (rec.tools || []).filter(
                                    (tool) => tool && tool.trim() !== ""
                                  )
                                )
                                .filter((tools) => tools.length > 0);

                            if (toolsByRecommendation.length === 0) {
                              return (
                                <span className="text-blue-600 text-sm italic">
                                  No tools available
                                </span>
                              );
                            }

                            // Round-robin selection: take 1 from each category, then repeat until we have 3
                            const selectedTools = [];
                            let roundIndex = 0;

                            while (
                              selectedTools.length < 3 &&
                              roundIndex <
                                Math.max(
                                  ...toolsByRecommendation.map(
                                    (tools) => tools.length
                                  )
                                )
                            ) {
                              for (
                                let i = 0;
                                i < toolsByRecommendation.length &&
                                selectedTools.length < 3;
                                i++
                              ) {
                                if (toolsByRecommendation[i][roundIndex]) {
                                  selectedTools.push(
                                    toolsByRecommendation[i][roundIndex]
                                  );
                                }
                              }
                              roundIndex++;
                            }

                            return selectedTools.map((tool, toolIndex) => (
                              <span
                                key={toolIndex}
                                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                              >
                                {tool}
                              </span>
                            ));
                          })()}
                        </div>
                      </div>

                      {/* Methodology Section */}
                      <div className="mb-6">
                        <h5 className="font-semibold text-blue-700 mb-2">
                          Methodology:
                        </h5>
                        {(() => {
                          // Separate negative and positive methodologies
                          const negativeMethodologies = category.recommendations
                            .filter((rec) => rec.status === "negative")
                            .flatMap((rec) => rec.methodology || [])
                            .filter((method) => method && method.trim() !== "");

                          const positiveMethodologies = category.recommendations
                            .filter((rec) => rec.status === "positive")
                            .flatMap((rec) => rec.methodology || [])
                            .filter((method) => method && method.trim() !== "");

                          // Combine: negative first, then positive
                          const orderedMethodologies = [
                            ...negativeMethodologies,
                            ...positiveMethodologies,
                          ];

                          return orderedMethodologies.length > 0 ? (
                            <div className="text-blue-600 text-sm">
                              {orderedMethodologies.map(
                                (method, methodIndex) => (
                                  <div
                                    key={methodIndex}
                                    className="flex items-start mb-1"
                                  >
                                    <span className="text-blue-500 mr-2">
                                      •
                                    </span>
                                    <span className="leading-relaxed">
                                      {method.trim()}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          ) : (
                            <span className="text-blue-600 text-sm italic">
                              No methodology available
                            </span>
                          );
                        })()}
                      </div>

                      {/* Enhanced Misconceptions Section */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-400 shadow-sm">
                        <button
                          onClick={() => toggleMisconceptions(category.title)}
                          className="flex items-center justify-between w-full text-left group hover:bg-blue-100 rounded-lg p-2 -m-2 transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              <LightBulbIcon />
                            </div>
                            <div>
                              <span className="font-bold text-blue-800 text-base">
                                Privacy Insights & Common Myths
                              </span>
                              <p className="text-blue-600 text-sm mt-1">
                                Click to reveal important misconceptions about{" "}
                                {category.title.toLowerCase()}
                              </p>
                            </div>
                          </div>
                          <div
                            className={`transform transition-all duration-300 flex-shrink-0 p-1 rounded-full group-hover:bg-blue-200 ${
                              expandedMisconceptions[category.title]
                                ? "rotate-180 bg-blue-200"
                                : "bg-blue-100"
                            }`}
                          >
                            <ChevronDownIcon />
                          </div>
                        </button>

                        {expandedMisconceptions[category.title] && (
                          <div className="mt-4 space-y-6 bg-white rounded-lg p-5 border border-blue-200 shadow-inner">
                            {category.misconceptions?.length > 0 ? (
                              category.misconceptions.map(
                                (item, misconceptionIndex) => (
                                  <div
                                    key={misconceptionIndex}
                                    className="space-y-3"
                                  >
                                    <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                                      <div className="mb-3">
                                        <div className="flex items-start gap-2 mb-2">
                                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex-shrink-0 mt-0.5">
                                            Myth
                                          </span>
                                          <span className="text-blue-800 font-medium italic leading-relaxed">
                                            "{item.misconceptionText}"
                                          </span>
                                        </div>
                                      </div>

                                      <div className="mb-3">
                                        <div className="flex items-start gap-2 mb-2">
                                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex-shrink-0 mt-0.5">
                                            Reality
                                          </span>
                                          <span className="text-blue-700 leading-relaxed">
                                            {item.realityCheck}
                                          </span>
                                        </div>
                                      </div>

                                      <div>
                                        <div className="flex items-start gap-2">
                                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 flex-shrink-0 mt-0.5">
                                            Impact
                                          </span>
                                          <span className="text-blue-600 leading-relaxed">
                                            {item.whyItMatters}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {misconceptionIndex <
                                      category.misconceptions.length - 1 && (
                                      <div className="flex justify-center">
                                        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
                                      </div>
                                    )}
                                  </div>
                                )
                              )
                            ) : (
                              <div className="text-center py-4">
                                <span className="text-blue-600 text-sm italic">
                                  No misconceptions data available for this
                                  category
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Score and Mini Chart */}
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div className="relative w-16 h-16 mb-2">
                        <svg
                          className="w-full h-full transform -rotate-90"
                          viewBox="0 0 42 42"
                        >
                          <circle
                            cx="21"
                            cy="21"
                            r="15.5"
                            stroke="#e5e7eb"
                            strokeWidth="3"
                            fill="transparent"
                          />
                          <circle
                            cx="21"
                            cy="21"
                            r="15.5"
                            stroke={
                              category.score >= 70
                                ? "#10b981"
                                : category.score >= 50
                                ? "#f59e0b"
                                : "#ef4444"
                            }
                            strokeWidth="3"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 15.5}`}
                            strokeDashoffset={`${
                              2 * Math.PI * 15.5 * (1 - category.score / 100)
                            }`}
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span
                            className={`font-bold text-sm ${
                              category.score >= 70
                                ? "text-green-600"
                                : category.score >= 50
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {category.score}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-blue-600 font-medium -ml-2">
                        Category Score
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stay Updated Card */}
          {/* <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 sm:p-8 border border-blue-200 mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-4">
              Stay Privacy-Protected
            </h3>
            <p className="text-blue-700 mb-6 leading-relaxed">
              Privacy threats evolve constantly. New data breaches, updated
              privacy policies, and emerging tracking technologies mean your
              privacy score can change. Regular reassessment ensures you stay
              ahead of new risks and maintain optimal protection.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Monthly Check-ups
                </h4>
                <p className="text-blue-700 text-sm">
                  Reassess your privacy posture as new threats emerge
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Updated Insights
                </h4>
                <p className="text-blue-700 text-sm">
                  Get fresh recommendations based on latest privacy research
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Track Progress
                </h4>
                <p className="text-blue-700 text-sm">
                  Monitor improvements and maintain your privacy gains
                </p>
              </div>
            </div>
          </div> */}

          <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 rounded-xl p-6 sm:p-8 border-2 border-blue-200 mb-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                <ShieldIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-blue-900">
                Stay Privacy-Protected
              </h3>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-6 border border-blue-100 shadow-sm">
              <p className="text-blue-700 leading-relaxed">
                Privacy threats evolve constantly. New data breaches, updated
                privacy policies, and emerging tracking technologies mean your
                privacy score can change. Regular reassessment ensures you stay
                ahead of new risks and maintain optimal protection.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <CalendarIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-blue-900">
                    Monthly Check-ups
                  </h4>
                </div>
                <p className="text-blue-700 text-sm">
                  Reassess your privacy posture as new threats emerge
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <LightBulbIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-blue-900">
                    Updated Insights
                  </h4>
                </div>
                <p className="text-blue-700 text-sm">
                  Get fresh recommendations based on latest privacy research
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUpIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-blue-900">
                    Track Progress
                  </h4>
                </div>
                <p className="text-blue-700 text-sm">
                  Monitor improvements and maintain your privacy gains
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRetakeAssessment}
              className="flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <RotateIcon />
              Retake Assessment
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center px-8 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <BellIcon />
              Subscribe for Updates
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="flex items-center justify-center px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <DownloadIcon />
              {isGeneratingPDF ? "Generating PDF..." : "Download PDF Report"}
            </button>

            <button
              onClick={handleBackToDashboard}
              className="flex items-center justify-center px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors duration-200"
            >
              <HomeIcon />
              Back to Dashboard
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 pb-6">
            <p className="text-blue-600 text-sm">
              Privacy Shield Assessment • Protecting Your Digital Identity
            </p>
          </div>
        </div>
      </div>

      <SubscriptionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default PrivacyReport;
