import os
import sys
import json
import pandas as pd
import unittest

sys.stdout.reconfigure(encoding='utf-8')

class TestAerocivilBIDashboard(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        cls.parquet_path = os.path.join(cls.base_dir, 'data', 'processed', 'transporte_aereo_limpio.parquet')
        cls.json_path = os.path.join(cls.base_dir, 'dashboard', 'js', 'data.json')
        
        cls.df = pd.read_parquet(cls.parquet_path)
        with open(cls.json_path, 'r', encoding='utf-8') as f:
            cls.data_json = json.load(f)

    def test_total_records_count(self):
        """Verifica que el número total de registros sea exactamente 455,787."""
        self.assertEqual(len(self.df), 455787)
        self.assertEqual(self.data_json['summary']['total_registros'], 455787)

    def test_total_passengers_exactness(self):
        """Verifica que la suma total de pasajeros sea consistente."""
        df_pax = float(self.df['Pasajeros'].sum())
        json_pax = float(self.data_json['summary']['total_pasajeros'])
        self.assertAlmostEqual(df_pax, json_pax, places=2)
        self.assertAlmostEqual(df_pax, 28985163.0, places=0)

    def test_total_cargo_exactness(self):
        """Verifica que la suma total de carga/correo en kg sea consistente."""
        df_cargo = float(self.df['Carga_Correo (Kg)'].sum())
        json_cargo = float(self.data_json['summary']['total_carga_kg'])
        self.assertAlmostEqual(df_cargo, json_cargo, places=2)

    def test_years_range(self):
        """Verifica que los años estandarizados abarquen de 2020 a 2026."""
        years = sorted(self.df['Año'].unique().tolist())
        self.assertEqual(years, [2020, 2021, 2022, 2023, 2024, 2025, 2026])

    def test_no_null_critical_fields(self):
        """Verifica que los campos críticos no contengan valores nulos."""
        self.assertEqual(self.df['Pasajeros'].isnull().sum(), 0)
        self.assertEqual(self.df['Carga_Correo (Kg)'].isnull().sum(), 0)
        self.assertEqual(self.df['Año'].isnull().sum(), 0)
        self.assertEqual(self.df['Número de Mes'].isnull().sum(), 0)
        self.assertEqual(self.df['Tráfico (N/I)'].isnull().sum(), 0)

if __name__ == '__main__':
    unittest.main()
