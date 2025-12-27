-- Migration: Create chart timeseries and signals tables
-- This migration creates tables for Druckenmiller-style technical analysis

CREATE TABLE chart_timeseries (
    id BIGSERIAL PRIMARY KEY,
    symbol VARCHAR NOT NULL,
    asset_class VARCHAR NOT NULL,
    date DATE NOT NULL,
    close_price NUMERIC NOT NULL,
    ma_8 NUMERIC,
    ma_20 NUMERIC,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_symbol_date ON chart_timeseries(symbol, date);
CREATE INDEX idx_asset_class ON chart_timeseries(asset_class);
CREATE UNIQUE INDEX uq_symbol_date ON chart_timeseries(symbol, date);

CREATE TABLE chart_signals (
    id BIGSERIAL PRIMARY KEY,
    symbol VARCHAR NOT NULL,
    timeframe VARCHAR NOT NULL,
    signal_date DATE NOT NULL,
    signal_type VARCHAR NOT NULL,
    ma_short NUMERIC,
    ma_long NUMERIC,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_symbol_timeframe_date ON chart_signals(symbol, timeframe, date);
CREATE INDEX idx_signal_type ON chart_signals(signal_type);
CREATE UNIQUE INDEX uq_symbol_timeframe_date ON chart_signals(symbol, timeframe, date);

CREATE TABLE chart_metadata (
    id BIGSERIAL PRIMARY KEY,
    symbol VARCHAR NOT NULL,
    asset_class VARCHAR NOT NULL,
    name VARCHAR,
    last_updated DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX uq_symbol_asset_class ON chart_metadata(symbol, asset_class);
