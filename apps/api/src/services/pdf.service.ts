// Path: apps/api/src/services/pdf.service.ts

// Generates GST-compliant invoice PDFs using pdfkit.
// Pure server-side generation — no headless browser, no file storage.
// Returns a Buffer that can be streamed directly to the response
// or attached to an email.

import PDFDocument from 'pdfkit';

// ── Types — shape of data needed to render an invoice ─────────────────

export type InvoicePdfData = {
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date | null;
  status: string;

  // Yaana Transit's own details (constant across invoices)
  yaanaGst: string | null;

  // Company being billed
  companyName: string;
  companyGst: string | null;
  companyAddress: string | null;
  companyCity: string | null;
  companyState: string | null;
  companyPincode: string | null;

  // Booking reference
  bookingRefNo: string;
  serviceType: string;
  startDate: Date;
  endDate: Date | null;
  vehicleName: string | null;
  chauffeurName: string | null;

  // Amounts
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  sacCode: string;
  gstType: string | null;

  notes: string | null;
};

// ── Brand constants ────────────────────────────────────────────────────
const BRAND_COLOR = '#3A6AB6';
const NAVY = '#0B1F3A';
const MUTED = '#6B7A90';
const LIGHT_BG = '#F7F9FC';
const BORDER = '#E2E8F2';

const YAANA_DETAILS = {
  name: 'Yaana Transit Pvt. Ltd.',
  address: 'Bengaluru, Karnataka, India',
  email: 'accounts@yaanatransit.com',
  phone: '+91 98765 43210',
};

// ── Helpers ────────────────────────────────────────────────────────────

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date: Date | null): string {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

const SERVICE_LABELS: Record<string, string> = {
  CHAUFFEUR_DRIVEN: 'Chauffeur Driven',
  AIRPORT_TRANSFER: 'Airport Transfer',
  OUTSTATION: 'Outstation',
  ETS: 'Employee Transportation Services',
  EVENTS: 'Events & Occasions',
  CORPORATE_LEASE: 'Corporate Lease',
};

// ── Main generator ─────────────────────────────────────────────────────

export function generateInvoicePdf(data: InvoicePdfData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const pageWidth = doc.page.width - 100; // minus margins

      // ── Header band ──────────────────────────────────────────────
      doc.rect(0, 0, doc.page.width, 110).fill(NAVY);

      doc
        .fillColor('#FFFFFF')
        .fontSize(20)
        .font('Helvetica-Bold')
        .text('YAANA TRANSIT', 50, 35);

      doc
        .fontSize(9)
        .font('Helvetica')
        .fillColor('#B8C5DB')
        .text('Driven by Trust', 50, 58)
        .text(YAANA_DETAILS.address, 50, 72)
        .text(`${YAANA_DETAILS.email}  •  ${YAANA_DETAILS.phone}`, 50, 84);

      // Invoice label top-right
      doc
        .fontSize(22)
        .font('Helvetica-Bold')
        .fillColor('#FFFFFF')
        .text('INVOICE', 0, 35, { align: 'right', width: pageWidth + 50 });

      doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor('#B8C5DB')
        .text(data.invoiceNumber, 0, 62, {
          align: 'right',
          width: pageWidth + 50,
        });

      // ── Bill To + Invoice Meta row ───────────────────────────────
      let y = 135;

      doc
        .fontSize(9)
        .font('Helvetica-Bold')
        .fillColor(MUTED)
        .text('BILL TO', 50, y);

      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .fillColor(NAVY)
        .text(data.companyName, 50, y + 14);

      let billY = y + 32;
      doc.fontSize(9).font('Helvetica').fillColor(MUTED);
      if (data.companyAddress) {
        doc.text(data.companyAddress, 50, billY);
        billY += 13;
      }
      const cityLine = [
        data.companyCity,
        data.companyState,
        data.companyPincode,
      ]
        .filter(Boolean)
        .join(', ');
      if (cityLine) {
        doc.text(cityLine, 50, billY);
        billY += 13;
      }
      if (data.companyGst) {
        doc.text(`GSTIN: ${data.companyGst}`, 50, billY);
        billY += 13;
      }

      // Invoice meta — right side
      const metaX = 320;
      const metaLabelW = 90;
      doc.fontSize(9).font('Helvetica-Bold').fillColor(MUTED);
      doc.text('Invoice Date', metaX, y);
      doc.text('Due Date', metaX, y + 16);
      doc.text('Booking Ref.', metaX, y + 32);
      doc.text('SAC Code', metaX, y + 48);

      doc.font('Helvetica').fillColor(NAVY);
      doc.text(formatDate(data.issueDate), metaX + metaLabelW, y);
      doc.text(formatDate(data.dueDate), metaX + metaLabelW, y + 16);
      doc.text(data.bookingRefNo, metaX + metaLabelW, y + 32);
      doc.text(data.sacCode, metaX + metaLabelW, y + 48);

      // ── Trip details box ─────────────────────────────────────────
      y = Math.max(billY, y + 70) + 20;

      doc.rect(50, y, pageWidth, 70).fill(LIGHT_BG);
      doc.rect(50, y, pageWidth, 70).strokeColor(BORDER).lineWidth(1).stroke();

      doc
        .fontSize(9)
        .font('Helvetica-Bold')
        .fillColor(MUTED)
        .text('TRIP DETAILS', 65, y + 12);

      const tripY = y + 28;
      doc.fontSize(9).font('Helvetica').fillColor(NAVY);
      doc.text(
        `Service: ${SERVICE_LABELS[data.serviceType] ?? data.serviceType}`,
        65,
        tripY
      );
      doc.text(
        `Date: ${formatDate(data.startDate)}${
          data.endDate ? ' to ' + formatDate(data.endDate) : ''
        }`,
        65,
        tripY + 16
      );
      if (data.vehicleName)
        doc.text(`Vehicle: ${data.vehicleName}`, 320, tripY);
      if (data.chauffeurName)
        doc.text(`Chauffeur: ${data.chauffeurName}`, 320, tripY + 16);

      y += 90;

      // ── Line items table ─────────────────────────────────────────
      const tableTop = y;
      const col = { desc: 50, qty: 330, rate: 400, amount: 470 };

      // Header row
      doc.rect(50, tableTop, pageWidth, 26).fill(NAVY);
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#FFFFFF');
      doc.text('DESCRIPTION', col.desc + 10, tableTop + 8);
      doc.text('QTY', col.qty, tableTop + 8, { width: 50, align: 'center' });
      doc.text('RATE', col.rate, tableTop + 8, { width: 60, align: 'right' });
      doc.text('AMOUNT', col.amount, tableTop + 8, {
        width: 80,
        align: 'right',
      });

      // Single line item row (transport service)
      const rowY = tableTop + 26;
      doc
        .rect(50, rowY, pageWidth, 32)
        .strokeColor(BORDER)
        .lineWidth(1)
        .stroke();
      doc.fontSize(9).font('Helvetica').fillColor(NAVY);
      doc.text(
        `${SERVICE_LABELS[data.serviceType] ?? data.serviceType} — ${
          data.bookingRefNo
        }`,
        col.desc + 10,
        rowY + 11,
        { width: 270 }
      );
      doc.text('1', col.qty, rowY + 11, { width: 50, align: 'center' });
      doc.text(formatINR(data.subtotal), col.rate, rowY + 11, {
        width: 60,
        align: 'right',
      });
      doc.text(formatINR(data.subtotal), col.amount, rowY + 11, {
        width: 80,
        align: 'right',
      });

      y = rowY + 32;

      // ── Totals box (right-aligned) ──────────────────────────────
      const totalsX = 320;
      const totalsW = pageWidth - (totalsX - 50);
      let totalsY = y + 16;

      const totalLine = (label: string, value: string, bold = false) => {
        doc
          .fontSize(9.5)
          .font(bold ? 'Helvetica-Bold' : 'Helvetica')
          .fillColor(bold ? NAVY : MUTED)
          .text(label, totalsX, totalsY, { width: totalsW - 90 });
        doc
          .font(bold ? 'Helvetica-Bold' : 'Helvetica')
          .fillColor(NAVY)
          .text(value, totalsX, totalsY, { width: totalsW, align: 'right' });
        totalsY += 18;
      };

      totalLine('Subtotal', `Rs. ${formatINR(data.subtotal)}`);
      if (data.gstType === 'IGST') {
        totalLine(`IGST (18%)`, `Rs. ${formatINR(data.igst)}`);
      } else {
        totalLine(`CGST (9%)`, `Rs. ${formatINR(data.cgst)}`);
        totalLine(`SGST (9%)`, `Rs. ${formatINR(data.sgst)}`);
      }

      // Divider
      doc
        .moveTo(totalsX, totalsY)
        .lineTo(totalsX + totalsW, totalsY)
        .strokeColor(BORDER)
        .lineWidth(1)
        .stroke();
      totalsY += 8;

      // Grand total — highlighted
      doc.rect(totalsX - 10, totalsY - 4, totalsW + 10, 28).fill(BRAND_COLOR);
      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .fillColor('#FFFFFF')
        .text('TOTAL', totalsX, totalsY + 4, { width: totalsW - 90 });
      doc.text(`Rs. ${formatINR(data.total)}`, totalsX, totalsY + 4, {
        width: totalsW,
        align: 'right',
      });

      y = totalsY + 50;

      // ── Notes ────────────────────────────────────────────────────
      if (data.notes) {
        doc
          .fontSize(9)
          .font('Helvetica-Bold')
          .fillColor(MUTED)
          .text('NOTES', 50, y);
        doc
          .fontSize(9)
          .font('Helvetica')
          .fillColor(NAVY)
          .text(data.notes, 50, y + 14, { width: pageWidth });
        y += 50;
      }

      // ── Footer ───────────────────────────────────────────────────
      const footerY = doc.page.height - 90;
      doc
        .moveTo(50, footerY)
        .lineTo(50 + pageWidth, footerY)
        .strokeColor(BORDER)
        .lineWidth(1)
        .stroke();

      doc
        .fontSize(8)
        .font('Helvetica')
        .fillColor(MUTED)
        .text(
          'This is a computer-generated invoice and does not require a physical signature.',
          50,
          footerY + 12,
          { width: pageWidth, align: 'center' }
        );

      doc
        .fontSize(8)
        .fillColor(MUTED)
        .text(
          `${YAANA_DETAILS.name}  •  ${YAANA_DETAILS.email}  •  ${YAANA_DETAILS.phone}`,
          50,
          footerY + 28,
          { width: pageWidth, align: 'center' }
        );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
