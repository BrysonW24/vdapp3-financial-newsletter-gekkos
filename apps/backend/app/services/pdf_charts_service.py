"""PDF generation service for Druckenmiller-style technical analysis charts."""

import io
from datetime import date, timedelta
from typing import Optional

from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib import colors
from sqlalchemy.orm import Session

from app.models.charts import ChartSignal
from app.services.signals_service import SignalsService


class PDFChartsService:
    """Service for generating PDF reports from technical analysis charts."""

    def __init__(self, db: Session):
        self.db = db
        self.signals_service = SignalsService(db)

    def generate_druckenmiller_report(
        self,
        target_date: Optional[date] = None,
        asset_classes: Optional[list[str]] = None
    ) -> bytes:
        """
        Generate a Druckenmiller-style technical analysis PDF report.

        Args:
            target_date: Date for the report (defaults to today)
            asset_classes: List of asset classes to include (all if None)

        Returns:
            PDF bytes
        """
        if target_date is None:
            target_date = date.today()

        if asset_classes is None:
            asset_classes = ["equity", "forex", "commodity", "bond"]

        # Create PDF document
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=landscape(letter),
            title="Druckenmiller Technical Analysis Report",
            author="Gekko Finance"
        )

        # Build document content
        story = []
        styles = getSampleStyleSheet()

        # Title
        title_style = ParagraphStyle(
            "CustomTitle",
            parent=styles["Heading1"],
            fontSize=24,
            textColor=colors.HexColor("#1f77b4"),
            spaceAfter=30,
            alignment=1  # Center
        )
        story.append(Paragraph("Druckenmiller Technical Analysis Report", title_style))
        story.append(Paragraph(f"As of {target_date.strftime('%B %d, %Y')}", styles["Normal"]))
        story.append(Spacer(1, 0.3 * inch))

        # Bullish signals section
        bullish_signals = self.signals_service.get_bullish_signals(
            days=7
        )

        if bullish_signals:
            story.append(Paragraph("Bullish Moving Average Crossovers", styles["Heading2"]))
            story.append(Spacer(1, 0.2 * inch))

            # Create table for signals
            bullish_data = [["Symbol", "Timeframe", "Date", "MA Short", "MA Long"]]
            for signal in bullish_signals:
                bullish_data.append([
                    signal["symbol"],
                    signal["timeframe"],
                    signal["date"],
                    f"${signal['ma_short']:.2f}" if signal["ma_short"] else "N/A",
                    f"${signal['ma_long']:.2f}" if signal["ma_long"] else "N/A",
                ])

            bullish_table = Table(bullish_data, colWidths=[1.5*inch, 1.5*inch, 1.5*inch, 1.5*inch, 1.5*inch])
            bullish_table.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#90EE90")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.black),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, 0), 10),
                ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
                ("BACKGROUND", (0, 1), (-1, -1), colors.beige),
                ("GRID", (0, 0), (-1, -1), 1, colors.black),
            ]))
            story.append(bullish_table)
            story.append(Spacer(1, 0.3 * inch))

        # Bearish signals section
        bearish_query = self.db.query(ChartSignal).filter(
            ChartSignal.signal_type == "bearish_cross",
            ChartSignal.signal_date >= target_date - timedelta(days=7)
        ).order_by(ChartSignal.signal_date.desc()).all()

        bearish_signals = [
            {
                "symbol": s.symbol,
                "timeframe": s.timeframe,
                "date": s.signal_date.isoformat(),
                "signal_type": s.signal_type,
                "ma_short": float(s.ma_short) if s.ma_short else None,
                "ma_long": float(s.ma_long) if s.ma_long else None,
            }
            for s in bearish_query
        ]

        if bearish_signals:
            story.append(PageBreak())
            story.append(Paragraph("Bearish Moving Average Crossovers", styles["Heading2"]))
            story.append(Spacer(1, 0.2 * inch))

            # Create table for signals
            bearish_data = [["Symbol", "Timeframe", "Date", "MA Short", "MA Long"]]
            for signal in bearish_signals:
                bearish_data.append([
                    signal["symbol"],
                    signal["timeframe"],
                    signal["date"],
                    f"${signal['ma_short']:.2f}" if signal["ma_short"] else "N/A",
                    f"${signal['ma_long']:.2f}" if signal["ma_long"] else "N/A",
                ])

            bearish_table = Table(bearish_data, colWidths=[1.5*inch, 1.5*inch, 1.5*inch, 1.5*inch, 1.5*inch])
            bearish_table.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#FFB6C6")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.black),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, 0), 10),
                ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
                ("BACKGROUND", (0, 1), (-1, -1), colors.lightgrey),
                ("GRID", (0, 0), (-1, -1), 1, colors.black),
            ]))
            story.append(bearish_table)
            story.append(Spacer(1, 0.3 * inch))

        # Summary section
        story.append(PageBreak())
        story.append(Paragraph("Analysis Summary", styles["Heading2"]))
        story.append(Spacer(1, 0.2 * inch))

        summary_text = f"""
        <br/>
        <b>Report Date:</b> {target_date.strftime('%B %d, %Y')}<br/>
        <b>Total Bullish Signals (7 days):</b> {len(bullish_signals)}<br/>
        <b>Total Bearish Signals (7 days):</b> {len(bearish_signals)}<br/>
        <br/>
        <b>Methodology:</b> This report tracks moving average crossovers across equity indices, forex pairs,
        commodities, and bond yields using the Druckenmiller approach.<br/>
        <br/>
        <b>Signal Interpretation:</b><br/>
        - <b>Bullish Cross:</b> Short-term MA (8-period) crosses above long-term MA (20-period)<br/>
        - <b>Bearish Cross:</b> Short-term MA (8-period) crosses below long-term MA (20-period)<br/>
        """
        story.append(Paragraph(summary_text, styles["Normal"]))

        # Build PDF
        doc.build(story)
        buffer.seek(0)
        return buffer.getvalue()

    def generate_signal_summary_table(
        self,
        days: int = 7
    ) -> dict:
        """
        Generate summary statistics of recent signals.

        Args:
            days: Number of days to analyze

        Returns:
            Dictionary with summary statistics
        """
        start_date = date.today() - timedelta(days=days)

        bullish = self.db.query(ChartSignal).filter(
            ChartSignal.signal_type == "bullish_cross",
            ChartSignal.signal_date >= start_date
        ).count()

        bearish = self.db.query(ChartSignal).filter(
            ChartSignal.signal_type == "bearish_cross",
            ChartSignal.signal_date >= start_date
        ).count()

        all_signals = self.db.query(ChartSignal).filter(
            ChartSignal.signal_date >= start_date
        ).all()

        # Count by asset class
        asset_class_counts = {}
        for signal in all_signals:
            # Join to get asset class info
            ts = self.db.query(ChartSignal).filter(
                ChartSignal.id == signal.id
            ).first()
            # Would need proper join here

        return {
            "period_days": days,
            "total_signals": bullish + bearish,
            "bullish_signals": bullish,
            "bearish_signals": bearish,
            "bullish_ratio": bullish / (bullish + bearish) if (bullish + bearish) > 0 else 0,
        }
