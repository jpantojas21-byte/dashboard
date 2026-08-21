/**
 * AERONÁUTICA CIVIL DE COLOMBIA - SISTEMA BI EJECUTIVO DE VISUALIZACIÓN
 * Engine de Javascript: Gestión de estado, Filtros globales dependientes y Plotly.js Charts
 */

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

const App = {
    data: null,
    filteredCube: [],
    filters: {
        year: 'ALL',
        month: 'ALL',
        trafico: 'ALL',
        tipoVuelo: 'ALL',
        empresa: 'ALL',
        origen: 'ALL',
        destino: 'ALL'
    },
    activeTab: 'view-summary',

    async init() {
        console.log("Inicializando Dashboard Ejecutivo UAEAC...");
        try {
            const response = await fetch('js/data.json');
            this.data = await response.json();
            console.log("Payload data.json cargado exitosamente:", this.data);
            
            this.populateFilterDropdowns();
            this.setupEventListeners();
            this.applyFilters();
        } catch (error) {
            console.error("Error al cargar data.json:", error);
        }
    },

    populateFilterDropdowns() {
        const selYear = document.getElementById('filter-year');
        const selMonth = document.getElementById('filter-month');
        const selEmpresa = document.getElementById('filter-empresa');
        const selOrigen = document.getElementById('filter-origen');
        const selDestino = document.getElementById('filter-destino');

        // Populate Years
        this.data.summary.anos_disponibles.forEach(y => {
            const opt = document.createElement('option');
            opt.value = y;
            opt.textContent = `Año ${y}`;
            selYear.appendChild(opt);
        });

        // Populate Months
        const MESES_NOMBRES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        this.data.summary.meses_disponibles.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m;
            opt.textContent = `${m} - ${MESES_NOMBRES[m-1]}`;
            selMonth.appendChild(opt);
        });

        // Populate Airlines (Top sorted)
        const empresasSet = new Set(this.data.cube.map(r => r.Nombre).filter(Boolean));
        Array.from(empresasSet).sort().forEach(emp => {
            const opt = document.createElement('option');
            opt.value = emp;
            opt.textContent = emp;
            selEmpresa.appendChild(opt);
        });

        // Populate Origins
        const origSet = new Set(this.data.cube.map(r => r['Ciudad Origen']).filter(Boolean));
        Array.from(origSet).sort().forEach(orig => {
            const opt = document.createElement('option');
            opt.value = orig;
            opt.textContent = orig;
            selOrigen.appendChild(opt);
        });

        // Populate Destinations
        const destSet = new Set(this.data.cube.map(r => r['Ciudad Destino']).filter(Boolean));
        Array.from(destSet).sort().forEach(dest => {
            const opt = document.createElement('option');
            opt.value = dest;
            opt.textContent = dest;
            selDestino.appendChild(opt);
        });
    },

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
                
                e.target.classList.add('active');
                const tabId = e.target.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
                this.activeTab = tabId;
                this.renderActiveTabCharts();
            });
        });

        // Filter change listeners
        document.getElementById('filter-year').addEventListener('change', (e) => { this.filters.year = e.target.value; this.applyFilters(); });
        document.getElementById('filter-month').addEventListener('change', (e) => { this.filters.month = e.target.value; this.applyFilters(); });
        document.getElementById('filter-trafico').addEventListener('change', (e) => { this.filters.trafico = e.target.value; this.applyFilters(); });
        document.getElementById('filter-tipo-vuelo').addEventListener('change', (e) => { this.filters.tipoVuelo = e.target.value; this.applyFilters(); });
        document.getElementById('filter-empresa').addEventListener('change', (e) => { this.filters.empresa = e.target.value; this.applyFilters(); });
        document.getElementById('filter-origen').addEventListener('change', (e) => { this.filters.origen = e.target.value; this.applyFilters(); });
        document.getElementById('filter-destino').addEventListener('change', (e) => { this.filters.destino = e.target.value; this.applyFilters(); });

        // Reset button
        document.getElementById('btn-reset-filters').addEventListener('click', () => {
            this.filters = { year: 'ALL', month: 'ALL', trafico: 'ALL', tipoVuelo: 'ALL', empresa: 'ALL', origen: 'ALL', destino: 'ALL' };
            document.querySelectorAll('.sidebar-filters select').forEach(sel => sel.value = 'ALL');
            this.applyFilters();
        });

        // Export CSV button
        document.getElementById('btn-export-csv').addEventListener('click', () => this.exportCSV());

        // Detail modal buttons
        document.getElementById('btn-view-detail').addEventListener('click', () => this.openDetailModal());
        document.getElementById('btn-close-modal').addEventListener('click', () => this.closeDetailModal());
        document.getElementById('modal-search').addEventListener('input', (e) => this.filterDetailModalTable(e.target.value));
    },

    applyFilters() {
        // Filter multidimensional cube
        this.filteredCube = this.data.cube.filter(row => {
            if (this.filters.year !== 'ALL' && row.Año != this.filters.year) return false;
            if (this.filters.month !== 'ALL' && row['Número de Mes'] != this.filters.month) return false;
            if (this.filters.trafico !== 'ALL' && row['Tráfico (N/I)'] !== this.filters.trafico) return false;
            if (this.filters.tipoVuelo !== 'ALL' && row['Tipo Vuelo'] !== this.filters.tipoVuelo) return false;
            if (this.filters.empresa !== 'ALL' && row.Nombre !== this.filters.empresa) return false;
            if (this.filters.origen !== 'ALL' && row['Ciudad Origen'] !== this.filters.origen) return false;
            if (this.filters.destino !== 'ALL' && row['Ciudad Destino'] !== this.filters.destino) return false;
            return true;
        });

        this.updateKPIs();
        this.renderActiveTabCharts();
    },

    updateKPIs() {
        let totalPax = 0;
        let totalKg = 0;
        let totalOps = 0;
        const empresasSet = new Set();
        const rutasSet = new Set();

        let paxNac = 0, paxInt = 0;
        let cargoNacKg = 0, cargoIntKg = 0;

        this.filteredCube.forEach(r => {
            totalPax += r.Pax;
            totalKg += r.Kg;
            totalOps += r.Vol;
            if (r.Nombre) empresasSet.add(r.Nombre);
            if (r['Ciudad Origen'] && r['Ciudad Destino']) rutasSet.add(`${r['Ciudad Origen']}-${r['Ciudad Destino']}`);

            if (r['Tráfico (N/I)'] === 'N') {
                paxNac += r.Pax;
                cargoNacKg += r.Kg;
            } else if (r['Tráfico (N/I)'] === 'I') {
                paxInt += r.Pax;
                cargoIntKg += r.Kg;
            }
        });

        const totalTon = totalKg / 1000.0;

        // Update KPI card texts
        document.getElementById('kpi-total-pax').textContent = totalPax.toLocaleString('es-CO');
        document.getElementById('kpi-total-cargo').textContent = totalTon.toLocaleString('es-CO', { maximumFractionDigits: 1 }) + " Ton";
        document.getElementById('kpi-total-ops').textContent = totalOps.toLocaleString('es-CO');
        document.getElementById('kpi-total-empresas').textContent = empresasSet.size.toLocaleString('es-CO');
        document.getElementById('kpi-total-rutas').textContent = rutasSet.size.toLocaleString('es-CO');

        // View 2 KPIs
        if (document.getElementById('kpi-pax-nacional')) {
            document.getElementById('kpi-pax-nacional').textContent = paxNac.toLocaleString('es-CO');
            document.getElementById('kpi-pax-internacional').textContent = paxInt.toLocaleString('es-CO');
            const avgMonth = totalPax / 12;
            document.getElementById('kpi-pax-promedio-mes').textContent = Math.round(avgMonth).toLocaleString('es-CO');
            const cuotaLider = totalPax > 0 ? ((this.getAirlinePax('AVIANCA') / totalPax) * 100).toFixed(1) + "%" : "0%";
            document.getElementById('kpi-pax-cuota-lider').textContent = cuotaLider;
        }

        // View 5 Cargo KPIs
        if (document.getElementById('kpi-cargo-total-ton')) {
            document.getElementById('kpi-cargo-total-ton').textContent = totalTon.toLocaleString('es-CO', { maximumFractionDigits: 1 });
            document.getElementById('kpi-cargo-int-ton').textContent = (cargoIntKg / 1000).toLocaleString('es-CO', { maximumFractionDigits: 1 });
            document.getElementById('kpi-cargo-nac-ton').textContent = (cargoNacKg / 1000).toLocaleString('es-CO', { maximumFractionDigits: 1 });
            document.getElementById('kpi-cargo-lider').textContent = "COPA AIRLINES";
        }
    },

    getAirlinePax(nameSubstring) {
        return this.filteredCube
            .filter(r => r.Nombre && r.Nombre.toUpperCase().includes(nameSubstring))
            .reduce((sum, r) => sum + r.Pax, 0);
    },

    renderActiveTabCharts() {
        if (this.activeTab === 'view-summary') {
            this.renderEvolutionChart();
            this.renderTraficoDonut();
            this.renderTopAirlinesBar();
            this.renderTopRoutesBar();
        } else if (this.activeTab === 'view-passengers') {
            this.renderAnnualCompareChart();
            this.renderCitiesOrigBar();
            this.renderFlightTypeDonut();
        } else if (this.activeTab === 'view-routes') {
            this.renderRoutesMatrix();
            this.renderAirportsOrigDest();
        } else if (this.activeTab === 'view-companies') {
            this.renderCompaniesScatter();
            this.renderCompaniesTypes();
        } else if (this.activeTab === 'view-cargo') {
            this.renderCargoEvolution();
            this.renderTopCargoCompanies();
            this.renderCargoTraficoDonut();
        }
    },

    // -------------------------------------------------------------
    // CHART RENDERING FUNCTIONS (PLOTLY.JS WITH CUSTOM EXECUTIVE THEME)
    // -------------------------------------------------------------
    getPlotlyTheme() {
        return {
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { family: 'Inter, sans-serif', color: '#94a3b8', size: 12 },
            margin: { t: 30, r: 20, l: 50, b: 40 },
            xaxis: { gridcolor: '#243048', zerolinecolor: '#334155' },
            yaxis: { gridcolor: '#243048', zerolinecolor: '#334155' }
        };
    },

    renderEvolutionChart() {
        // Group filteredCube by (Año, Mes)
        const map = {};
        this.filteredCube.forEach(r => {
            const key = `${r.Año}-${String(r['Número de Mes']).padStart(2, '0')}`;
            if (!map[key]) map[key] = { pax: 0, kg: 0 };
            map[key].pax += r.Pax;
            map[key].kg += r.Kg;
        });

        const sortedKeys = Object.keys(map).sort();
        const paxSeries = sortedKeys.map(k => map[k].pax);
        const cargoSeries = sortedKeys.map(k => map[k].kg / 1000.0);

        const trace1 = {
            x: sortedKeys,
            y: paxSeries,
            name: 'Pasajeros Transportados',
            type: 'scatter',
            mode: 'lines+markers',
            line: { color: '#0284c7', width: 3, shape: 'spline' },
            marker: { size: 6, color: '#38bdf8' }
        };

        const trace2 = {
            x: sortedKeys,
            y: cargoSeries,
            name: 'Carga (Toneladas)',
            type: 'bar',
            yaxis: 'y2',
            marker: { color: 'rgba(16, 185, 129, 0.4)', line: { color: '#10b981', width: 1 } }
        };

        const layout = {
            ...this.getPlotlyTheme(),
            yaxis: { title: 'Pasajeros', gridcolor: '#243048' },
            yaxis2: { title: 'Carga (Ton)', overlaying: 'y', side: 'right', gridcolor: 'transparent' },
            legend: { orientation: 'h', y: 1.15 }
        };

        Plotly.newPlot('chart-evolution-main', [trace2, trace1], layout, { responsive: true, displayModeBar: false });
    },

    renderTraficoDonut() {
        const map = { N: 0, I: 0, E: 0 };
        this.filteredCube.forEach(r => {
            if (map[r['Tráfico (N/I)']] !== undefined) {
                map[r['Tráfico (N/I)']] += r.Pax;
            }
        });

        const data = [{
            values: [map.N, map.I, map.E],
            labels: ['Nacional (N)', 'Internacional (I)', 'Especial (E)'],
            type: 'pie',
            hole: 0.55,
            marker: { colors: ['#0284c7', '#10b981', '#f59e0b'] },
            textinfo: 'label+percent',
            insidetextorientation: 'radial'
        }];

        const layout = {
            ...this.getPlotlyTheme(),
            showlegend: true,
            legend: { orientation: 'h', y: -0.1 }
        };

        Plotly.newPlot('chart-trafico-donut', data, layout, { responsive: true, displayModeBar: false });
    },

    renderTopAirlinesBar() {
        const map = {};
        this.filteredCube.forEach(r => {
            if (!r.Nombre) return;
            map[r.Nombre] = (map[r.Nombre] || 0) + r.Pax;
        });

        const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 10).reverse();
        const names = sorted.map(d => d[0].length > 25 ? d[0].substring(0, 25) + '...' : d[0]);
        const values = sorted.map(d => d[1]);

        const trace = {
            x: values,
            y: names,
            type: 'bar',
            orientation: 'h',
            marker: { color: '#0284c7', borderRadius: 4 }
        };

        const layout = {
            ...this.getPlotlyTheme(),
            margin: { l: 180, t: 20, r: 20, b: 30 }
        };

        Plotly.newPlot('chart-top-airlines-bar', [trace], layout, { responsive: true, displayModeBar: false });
    },

    renderTopRoutesBar() {
        const map = {};
        this.filteredCube.forEach(r => {
            if (!r['Ciudad Origen'] || !r['Ciudad Destino']) return;
            const route = `${r['Ciudad Origen']} → ${r['Ciudad Destino']}`;
            map[route] = (map[route] || 0) + r.Pax;
        });

        const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 10);
        const names = sorted.map(d => d[0]);
        const values = sorted.map(d => d[1]);

        const trace = {
            x: names,
            y: values,
            type: 'bar',
            marker: { color: '#10b981', borderRadius: 4 }
        };

        const layout = {
            ...this.getPlotlyTheme(),
            xaxis: { tickangle: -25, gridcolor: '#243048' }
        };

        Plotly.newPlot('chart-top-routes-bar', [trace], layout, { responsive: true, displayModeBar: false });
    },

    renderAnnualCompareChart() {
        const map = {};
        this.filteredCube.forEach(r => {
            map[r.Año] = (map[r.Año] || 0) + r.Pax;
        });

        const years = Object.keys(map).sort();
        const values = years.map(y => map[y]);

        const trace = {
            x: years.map(y => `Año ${y}`),
            y: values,
            type: 'bar',
            marker: { color: '#38bdf8', borderRadius: 6 }
        };

        const layout = {
            ...this.getPlotlyTheme(),
            yaxis: { title: 'Pasajeros Total' }
        };

        Plotly.newPlot('chart-pax-annual-compare', [trace], layout, { responsive: true, displayModeBar: false });
    },

    renderCitiesOrigBar() {
        const map = {};
        this.filteredCube.forEach(r => {
            if (!r['Ciudad Origen']) return;
            map[r['Ciudad Origen']] = (map[r['Ciudad Origen']] || 0) + r.Pax;
        });

        const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 15).reverse();
        const names = sorted.map(d => d[0]);
        const values = sorted.map(d => d[1]);

        const trace = {
            x: values,
            y: names,
            type: 'bar',
            orientation: 'h',
            marker: { color: '#8b5cf6' }
        };

        const layout = {
            ...this.getPlotlyTheme(),
            margin: { l: 150, t: 20, r: 20, b: 30 }
        };

        Plotly.newPlot('chart-pax-cities-orig', [trace], layout, { responsive: true, displayModeBar: false });
    },

    renderFlightTypeDonut() {
        const TYPE_MAP = { R: 'Regular (R)', C: 'Charter (C)', T: 'Taxi Aéreo (T)', A: 'Adicional (A)', N: 'No Regular (N)' };
        const map = {};
        this.filteredCube.forEach(r => {
            const label = TYPE_MAP[r['Tipo Vuelo']] || r['Tipo Vuelo'];
            map[label] = (map[label] || 0) + r.Pax;
        });

        const labels = Object.keys(map);
        const values = Object.values(map);

        const data = [{
            values: values,
            labels: labels,
            type: 'pie',
            hole: 0.5,
            marker: { colors: ['#0284c7', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'] }
        }];

        Plotly.newPlot('chart-pax-flight-type', data, this.getPlotlyTheme(), { responsive: true, displayModeBar: false });
    },

    renderRoutesMatrix() {
        const map = {};
        this.filteredCube.forEach(r => {
            if (!r['Ciudad Origen'] || !r['Ciudad Destino']) return;
            const route = `${r['Ciudad Origen']} - ${r['Ciudad Destino']}`;
            map[route] = (map[route] || 0) + r.Pax;
        });

        const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 25).reverse();
        const names = sorted.map(d => d[0]);
        const values = sorted.map(d => d[1]);

        const trace = {
            x: values,
            y: names,
            type: 'bar',
            orientation: 'h',
            marker: { color: '#0284c7' }
        };

        const layout = {
            ...this.getPlotlyTheme(),
            margin: { l: 240, t: 20, r: 20, b: 30 }
        };

        Plotly.newPlot('chart-routes-matrix', [trace], layout, { responsive: true, displayModeBar: false });
    },

    renderAirportsOrigDest() {
        const mapOrig = {};
        const mapDest = {};
        this.filteredCube.forEach(r => {
            if (r['Ciudad Origen']) mapOrig[r['Ciudad Origen']] = (mapOrig[r['Ciudad Origen']] || 0) + r.Pax;
            if (r['Ciudad Destino']) mapDest[r['Ciudad Destino']] = (mapDest[r['Ciudad Destino']] || 0) + r.Pax;
        });

        const sortedOrig = Object.entries(mapOrig).sort((a, b) => b[1] - a[1]).slice(0, 15);
        const sortedDest = Object.entries(mapDest).sort((a, b) => b[1] - a[1]).slice(0, 15);

        const trace1 = {
            x: sortedOrig.map(d => d[0]),
            y: sortedOrig.map(d => d[1]),
            type: 'bar',
            name: 'Origen (Salidas)',
            marker: { color: '#0284c7' }
        };

        Plotly.newPlot('chart-airports-orig', [trace1], { ...this.getPlotlyTheme(), xaxis: { tickangle: -30 } }, { responsive: true, displayModeBar: false });

        const trace2 = {
            x: sortedDest.map(d => d[0]),
            y: sortedDest.map(d => d[1]),
            type: 'bar',
            name: 'Destino (Llegadas)',
            marker: { color: '#10b981' }
        };

        Plotly.newPlot('chart-airports-dest', [trace2], { ...this.getPlotlyTheme(), xaxis: { tickangle: -30 } }, { responsive: true, displayModeBar: false });
    },

    renderCompaniesScatter() {
        const map = {};
        this.filteredCube.forEach(r => {
            if (!r.Nombre) return;
            if (!map[r.Nombre]) map[r.Nombre] = { pax: 0, kg: 0, ops: 0 };
            map[r.Nombre].pax += r.Pax;
            map[r.Nombre].kg += r.Kg;
            map[r.Nombre].ops += r.Vol;
        });

        const sorted = Object.entries(map).sort((a, b) => b[1].pax - a[1].pax).slice(0, 25);

        const names = sorted.map(d => d[0]);
        const pax = sorted.map(d => d[1].pax);
        const ton = sorted.map(d => d[1].kg / 1000.0);
        const ops = sorted.map(d => d[1].ops);

        const trace = {
            x: pax,
            y: ton,
            text: names,
            mode: 'markers',
            marker: {
                size: ops.map(v => Math.max(8, Math.min(45, v / 500))),
                color: pax,
                colorscale: 'Viridis',
                showscale: true
            }
        };

        const layout = {
            ...this.getPlotlyTheme(),
            xaxis: { title: 'Pasajeros Transportados' },
            yaxis: { title: 'Carga (Toneladas)' }
        };

        Plotly.newPlot('chart-companies-scatter', [trace], layout, { responsive: true, displayModeBar: false });
    },

    renderCompaniesTypes() {
        const map = {};
        this.filteredCube.forEach(r => {
            if (!r.Nombre) return;
            if (!map[r.Nombre]) map[r.Nombre] = { R: 0, C: 0, T: 0, A: 0 };
            const type = r['Tipo Vuelo'];
            if (map[r.Nombre][type] !== undefined) map[r.Nombre][type] += r.Pax;
        });

        const topAirlines = Object.entries(map)
            .map(([name, types]) => ({ name, total: types.R + types.C + types.T + types.A, types }))
            .sort((a, b) => b.total - a.total).slice(0, 15);

        const names = topAirlines.map(d => d.name.length > 20 ? d.name.substring(0, 20) + '...' : d.name);

        const traceR = { x: names, y: topAirlines.map(d => d.types.R), name: 'Regular (R)', type: 'bar', marker: { color: '#0284c7' } };
        const traceC = { x: names, y: topAirlines.map(d => d.types.C), name: 'Charter (C)', type: 'bar', marker: { color: '#8b5cf6' } };
        const traceT = { x: names, y: topAirlines.map(d => d.types.T), name: 'Taxi Aéreo (T)', type: 'bar', marker: { color: '#10b981' } };

        const layout = {
            ...this.getPlotlyTheme(),
            barmode: 'stack',
            xaxis: { tickangle: -25 }
        };

        Plotly.newPlot('chart-companies-types', [traceR, traceC, traceT], layout, { responsive: true, displayModeBar: false });
    },

    renderCargoEvolution() {
        const map = {};
        this.filteredCube.forEach(r => {
            const key = `${r.Año}-${String(r['Número de Mes']).padStart(2, '0')}`;
            map[key] = (map[key] || 0) + (r.Kg / 1000.0);
        });

        const sortedKeys = Object.keys(map).sort();
        const values = sortedKeys.map(k => map[k]);

        const trace = {
            x: sortedKeys,
            y: values,
            type: 'scatter',
            fill: 'tozeroy',
            mode: 'lines',
            line: { color: '#10b981', width: 2 }
        };

        const layout = {
            ...this.getPlotlyTheme(),
            yaxis: { title: 'Carga/Correo (Toneladas)' }
        };

        Plotly.newPlot('chart-cargo-evolution', [trace], layout, { responsive: true, displayModeBar: false });
    },

    renderTopCargoCompanies() {
        const map = {};
        this.filteredCube.forEach(r => {
            if (!r.Nombre) return;
            map[r.Nombre] = (map[r.Nombre] || 0) + (r.Kg / 1000.0);
        });

        const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 10).reverse();
        const names = sorted.map(d => d[0].length > 25 ? d[0].substring(0, 25) + '...' : d[0]);
        const values = sorted.map(d => d[1]);

        const trace = {
            x: values,
            y: names,
            type: 'bar',
            orientation: 'h',
            marker: { color: '#10b981' }
        };

        const layout = {
            ...this.getPlotlyTheme(),
            margin: { l: 180, t: 20, r: 20, b: 30 }
        };

        Plotly.newPlot('chart-cargo-top-companies', [trace], layout, { responsive: true, displayModeBar: false });
    },

    renderCargoTraficoDonut() {
        const map = { N: 0, I: 0, E: 0 };
        this.filteredCube.forEach(r => {
            if (map[r['Tráfico (N/I)']] !== undefined) {
                map[r['Tráfico (N/I)']] += (r.Kg / 1000.0);
            }
        });

        const data = [{
            values: [map.N, map.I, map.E],
            labels: ['Nacional (N)', 'Internacional (I)', 'Especial (E)'],
            type: 'pie',
            hole: 0.5,
            marker: { colors: ['#0284c7', '#10b981', '#f59e0b'] }
        }];

        Plotly.newPlot('chart-cargo-trafico-donut', data, this.getPlotlyTheme(), { responsive: true, displayModeBar: false });
    },

    // -------------------------------------------------------------
    // EXPORT & MODAL DATA DETAIL
    // -------------------------------------------------------------
    exportCSV() {
        if (!this.filteredCube || this.filteredCube.length === 0) return;
        
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Ano,Mes,Trafico,TipoVuelo,Empresa,CiudadOrigen,CiudadDestino,Pasajeros,CargaKg,Vuelos\n";
        
        this.filteredCube.slice(0, 5000).forEach(r => {
            const rowStr = [
                r.Año,
                r['Número de Mes'],
                `"${r['Tráfico (N/I)']}"`,
                `"${r['Tipo Vuelo']}"`,
                `"${(r.Nombre || '').replace(/"/g, '""')}"`,
                `"${(r['Ciudad Origen'] || '').replace(/"/g, '""')}"`,
                `"${(r['Ciudad Destino'] || '').replace(/"/g, '""')}"`,
                r.Pax,
                r.Kg,
                r.Vol
            ].join(",");
            csvContent += rowStr + "\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `aerocivil_movilidad_aerea_export.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    openDetailModal() {
        document.getElementById('modal-detail').classList.add('active');
        this.filterDetailModalTable('');
    },

    closeDetailModal() {
        document.getElementById('modal-detail').classList.remove('active');
    },

    filterDetailModalTable(searchTerm) {
        const tbody = document.getElementById('table-detail-body');
        tbody.innerHTML = '';
        
        const term = searchTerm.toLowerCase();
        const records = this.filteredCube.filter(r => {
            if (!term) return true;
            return (r.Nombre || '').toLowerCase().includes(term) ||
                   (r['Ciudad Origen'] || '').toLowerCase().includes(term) ||
                   (r['Ciudad Destino'] || '').toLowerCase().includes(term);
        }).slice(0, 100); // Limit to top 100 for fast DOM rendering

        document.getElementById('modal-record-count').textContent = `Mostrando ${records.length} de ${this.filteredCube.length} registros filtrados`;

        records.forEach(r => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${r.Año}</td>
                <td>${r['Número de Mes']}</td>
                <td>${r['Tráfico (N/I)']}</td>
                <td>${r['Tipo Vuelo']}</td>
                <td>${r.Nombre || '--'}</td>
                <td>${r['Ciudad Origen']}</td>
                <td>${r['Ciudad Destino']}</td>
                <td><strong>${r.Pax.toLocaleString('es-CO')}</strong></td>
                <td>${r.Kg.toLocaleString('es-CO', { maximumFractionDigits: 1 })} kg</td>
            `;
            tbody.appendChild(tr);
        });
    }
};
