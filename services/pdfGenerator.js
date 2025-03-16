import puppeteer from 'puppeteer';

export async function generatePDF(reportData) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Generate HTML content for the PDF
  const htmlContent = generateReportHTML(reportData);
  await page.setContent(htmlContent);
  
  // Generate PDF
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20px',
      right: '20px',
      bottom: '20px',
      left: '20px'
    }
  });
  
  await browser.close();
  return pdf;
}

function generateReportHTML(data) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .header { text-align: center; margin-bottom: 30px; }
          .section { margin-bottom: 20px; }
          .property-details { display: grid; grid-template-columns: 1fr 1fr; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Rental Property Analysis Report</h1>
          <p>${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="section">
          <h2>Property Details</h2>
          <div class="property-details">
            <p><strong>Address:</strong> ${data.address}</p>
            <p><strong>Property Type:</strong> ${data.propertyType}</p>
            <p><strong>Bedrooms:</strong> ${data.beds}</p>
            <p><strong>Bathrooms:</strong> ${data.baths}</p>
            <p><strong>Square Footage:</strong> ${data.sqft}</p>
            <p><strong>Year Built:</strong> ${data.yearBuilt}</p>
          </div>
        </div>
        
        <div class="section">
          <h2>Market Analysis</h2>
          <p><strong>Suggested Rent Range:</strong> $${data.rentRange.min} - $${data.rentRange.max}</p>
          <p><strong>Median Rent:</strong> $${data.medianRent}</p>
          <p><strong>Price per Sqft:</strong> $${data.pricePerSqft}/sqft</p>
        </div>
        
        <div class="section">
          <h2>Neighborhood Analysis</h2>
          <p><strong>Crime Rate:</strong> ${data.crimeRate}</p>
          <p><strong>School Rating:</strong> ${data.schoolRating}</p>
          <p><strong>Walk Score:</strong> ${data.walkScore}</p>
        </div>
      </body>
    </html>
  `;
} 