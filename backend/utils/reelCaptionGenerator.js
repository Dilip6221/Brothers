const generateReelCaption = ({ job, car, services }) => {
  const carName = `${car?.company || ""} ${car?.model || ""}`.trim() || "This car";

  const serviceLines = (services || [])
    .map((s) => s.serviceName || s.packageName)
    .filter(Boolean)
    .map((name) => `• ${name}`)
    .join("\n");

  return `${carName} received a premium transformation at RYDAX Studio.

Services performed:
${serviceLines || "• Premium Car Care"}

From ordinary to premium — restored with precision, care and detailing excellence.
#RYDAXStudio #CarDetailing #CarCare #AutoDetailing #CarTransformation`;
};

module.exports = { generateReelCaption };