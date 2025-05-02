
import BottomNav from "@/components/bottom-nav";
import { PieChart, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, Line, Pie } from "recharts";
import { ArrowUpRight, ArrowDownLeft, TrendingUp, ChevronRight } from "lucide-react";

const mockMonthlyData = [
  { name: 'Jan', expenses: 1200, income: 2500 },
  { name: 'Fev', expenses: 1350, income: 2500 },
  { name: 'Mar', expenses: 1700, income: 2800 },
  { name: 'Abr', expenses: 1500, income: 2900 },
  { name: 'Mai', expenses: 1800, income: 3200 }
];

const mockCategoryData = [
  { name: 'Alimentação', value: 450, color: '#00BFA5' },
  { name: 'Transporte', value: 300, color: '#FF5252' },
  { name: 'Lazer', value: 200, color: '#FFC107' },
  { name: 'Moradia', value: 950, color: '#2196F3' },
  { name: 'Outros', value: 350, color: '#9C27B0' }
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-nox-card p-3 rounded-lg border border-zinc-800 shadow-lg">
        <p className="text-nox-primary font-medium">{`${payload[0].name}`}</p>
        <p className="text-sm text-white">{`Receita: R$ ${payload[0].value.toFixed(2)}`}</p>
        <p className="text-sm text-white">{`Despesa: R$ ${payload[1].value.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

const CategoryItem = ({ name, value, color }: { name: string, value: number, color: string }) => (
  <div className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0">
    <div className="flex items-center">
      <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: color }}></div>
      <span className="text-white">{name}</span>
    </div>
    <span className="text-white font-medium">R$ {value.toFixed(2)}</span>
  </div>
);

const Finance = () => {
  return (
    <div className="min-h-screen bg-nox-background pb-20">
      {/* Header */}
      <header className="p-5">
        <h1 className="text-xl font-semibold text-white">Finanças</h1>
      </header>
      
      {/* Summary */}
      <div className="px-5 mb-6">
        <div className="bg-nox-card rounded-xl p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Resumo do mês</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-nox-background/50 rounded-lg p-3">
              <div className="flex items-center mb-1">
                <ArrowDownLeft className="h-4 w-4 text-emerald-500 mr-1" />
                <span className="text-sm text-nox-textSecondary">Receitas</span>
              </div>
              <p className="text-lg font-semibold text-white">R$ 3.200,00</p>
            </div>
            <div className="bg-nox-background/50 rounded-lg p-3">
              <div className="flex items-center mb-1">
                <ArrowUpRight className="h-4 w-4 text-rose-500 mr-1" />
                <span className="text-sm text-nox-textSecondary">Despesas</span>
              </div>
              <p className="text-lg font-semibold text-white">R$ 1.800,00</p>
            </div>
          </div>
          <div className="bg-nox-background/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-nox-primary mr-1" />
                <span className="text-sm text-nox-textSecondary">Saldo</span>
              </div>
              <span className="text-sm text-nox-textSecondary">Mai/2023</span>
            </div>
            <p className="text-lg font-semibold text-white">R$ 1.400,00</p>
          </div>
        </div>
      </div>
      
      {/* Monthly Chart */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">Evolução mensal</h3>
          <button className="flex items-center text-nox-primary text-sm">
            Ver mais <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        <div className="bg-nox-card rounded-xl p-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={mockMonthlyData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#B0B0B0" />
              <YAxis stroke="#B0B0B0" />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#00BFA5" 
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2, fill: '#00BFA5' }}
                name="Receita"
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#FF5252" 
                strokeWidth={2} 
                dot={{ r: 4, strokeWidth: 2, fill: '#FF5252' }}
                name="Despesa"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Categories */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">Despesas por categoria</h3>
          <button className="flex items-center text-nox-primary text-sm">
            Ver mais <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-nox-card rounded-xl p-4 h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {mockCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-nox-card rounded-xl overflow-hidden">
            <div className="p-4">
              {mockCategoryData.map((category, index) => (
                <CategoryItem
                  key={index}
                  name={category.name}
                  value={category.value}
                  color={category.color}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <BottomNav activeTab="finance" />
    </div>
  );
};

export default Finance;
