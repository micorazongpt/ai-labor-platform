import React, { useState, useEffect, createContext, useContext } from 'react';
import { Calculator, Clock, DollarSign, Calendar, Heart, Shield, FileText, TrendingUp, Users, Award, ChevronRight, ArrowLeft, Home, Download, Star, Lock, Crown, BarChart3, AlertCircle, CheckCircle, Info, Menu, X, Search, Bell, User, Plus, Minus } from 'lucide-react';

// ==================== ADVANCED CHARTS ====================
const AdvancedLineChart = ({ data, title, xKey, yKey, color = "blue" }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const maxValue = Math.max(...data.map(d => d[yKey]));
  const minValue = Math.min(...data.map(d => d[yKey]));
  const range = maxValue - minValue;

  const getPath = () => {
    const width = 400;
    const height = 200;
    const padding = 40;

    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * (width - 2 * padding) + padding;
      const y = height - padding - ((item[yKey] - minValue) / range) * (height - 2 * padding);
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  const getGradientPath = () => {
    const width = 400;
    const height = 200;
    const padding = 40;

    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * (width - 2 * padding) + padding;
      const y = height - padding - ((item[yKey] - minValue) / range) * (height - 2 * padding);
      return `${x},${y}`;
    });

    return `M ${padding},${height - padding} L ${points.join(' L ')} L ${400 - padding},${height - padding} Z`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border dark:border-gray-700 transition-colors">
      <h5 className="font-bold text-lg text-gray-900 dark:text-white mb-6">{title}</h5>
      <div className="relative">
        <svg width="400" height="200" className="overflow-visible">
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" className={`text-${color}-400`} style={{stopColor: 'currentColor', stopOpacity: 0.3}} />
              <stop offset="100%" className={`text-${color}-400`} style={{stopColor: 'currentColor', stopOpacity: 0.05}} />
            </linearGradient>
          </defs>

          {/* 그리드 라인 */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <line 
              key={i}
              x1="40" 
              y1={40 + (i * 25)} 
              x2="360" 
              y2={40 + (i * 25)}
              stroke="currentColor" 
              className="text-gray-200 dark:text-gray-600"
              strokeWidth="0.5"
            />
          ))}

          {/* 그라데이션 영역 */}
          <path
            d={getGradientPath()}
            fill={`url(#gradient-${color})`}
            className="transition-all duration-700"
          />

          {/* 메인 라인 */}
          <path
            d={getPath()}
            fill="none"
            stroke="currentColor"
            className={`text-${color}-500 transition-all duration-700`}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 데이터 포인트 */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 320 + 40;
            const y = 160 - ((item[yKey] - minValue) / range) * 120 + 40;

            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r={hoveredPoint === index ? "8" : "6"}
                fill="currentColor"
                className={`text-${color}-500 cursor-pointer transition-all duration-200`}
                onMouseEnter={() => setHoveredPoint(index)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            );
          })}
        </svg>

        {/* 호버 툴팁 */}
        {hoveredPoint !== null && (
          <div className="absolute top-0 left-0 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg px-3 py-2 pointer-events-none z-10 transform -translate-x-1/2 -translate-y-full shadow-lg">
            {data[hoveredPoint][xKey]}: {data[hoveredPoint][yKey].toLocaleString()}
          </div>
        )}
      </div>

      {/* 범례 */}
      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-4">
        <span>{data[0]?.[xKey]}</span>
        <span>{data[data.length - 1]?.[xKey]}</span>
      </div>
    </div>
  );
};

const InteractivePieChart = ({ data, title, centerText }) => {
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const colors = [
    'text-blue-500', 'text-green-500', 'text-amber-500', 
    'text-red-500', 'text-purple-500', 'text-pink-500'
  ];

  let currentAngle = 0;
  const segments = data.map((item, index) => {
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle += angle;

    const isLarge = angle > 180 ? 1 : 0;
    const x1 = Math.cos((startAngle * Math.PI) / 180) * 80;
    const y1 = Math.sin((startAngle * Math.PI) / 180) * 80;
    const x2 = Math.cos((endAngle * Math.PI) / 180) * 80;
    const y2 = Math.sin((endAngle * Math.PI) / 180) * 80;

    const pathData = [
      `M 80 80`,
      `L ${80 + x1} ${80 + y1}`,
      `A 80 80 0 ${isLarge} 1 ${80 + x2} ${80 + y2}`,
      `Z`
    ].join(' ');

    return {
      ...item,
      pathData,
      color: colors[index % colors.length],
      percentage: ((item.value / total) * 100).toFixed(1)
    };
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border dark:border-gray-700 transition-colors">
      <h5 className="font-bold text-lg text-gray-900 dark:text-white mb-6 text-center">{title}</h5>

      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <svg width="280" height="280" viewBox="0 0 160 160" className="transform -rotate-90">
            {segments.map((segment, index) => (
              <path
                key={index}
                d={segment.pathData}
                fill="currentColor"
                className={`${segment.color} cursor-pointer transition-all duration-300 ${
                  hoveredSegment === index ? 'opacity-90 transform scale-105' : 'opacity-80'
                }`}
                onMouseEnter={() => setHoveredSegment(index)}
                onMouseLeave={() => setHoveredSegment(null)}
                style={{
                  transformOrigin: '80px 80px',
                  filter: hoveredSegment === index ? 'brightness(1.1)' : 'none'
                }}
              />
            ))}
          </svg>

          {/* 중앙 텍스트 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{centerText}</div>
              {hoveredSegment !== null && (
                <div className="text-lg text-gray-600 dark:text-gray-300">
                  {segments[hoveredSegment].percentage}%
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 범례 */}
      <div className="space-y-3">
        {segments.map((segment, index) => (
          <div 
            key={index} 
            className={`flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer ${
              hoveredSegment === index ? 'bg-gray-50 dark:bg-gray-700' : ''
            }`}
            onMouseEnter={() => setHoveredSegment(index)}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${segment.color.replace('text-', 'bg-')}`}></div>
              <span className="text-gray-600 dark:text-gray-300 font-medium">{segment.label}</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900 dark:text-white">
                {typeof segment.value === 'number' ? segment.value.toLocaleString() : segment.value}
              </div>
              <div className="text-sm text-gray-500">{segment.percentage}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== DARK MODE ====================
const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('ai-labor-dark-mode');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ai-labor-dark-mode', JSON.stringify(isDark));
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {}
  }, [isDark]);

  const toggleDarkMode = () => setIsDark(!isDark);

  return { isDark, toggleDarkMode };
};

const DarkModeToggle = ({ isDark, onToggle }) => (
  <button
    onClick={onToggle}
    className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    title={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
  >
    {isDark ? (
      <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-base">☀️</div>
    ) : (
      <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-base">🌙</div>
    )}
  </button>
);

// ==================== CONTEXT & DATA ====================
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState('home');
  const [currentCalculator, setCurrentCalculator] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: '연차 3일이 다음 달 소멸 예정입니다', type: 'warning', isRead: false },
    { id: 2, message: '퇴직금 계산이 완료되었습니다', type: 'success', isRead: false }
  ]);

  // 다크모드 훅
  const { isDark, toggleDarkMode } = useDarkMode();

  // 저장된 계산 입력값들
  const [savedInputs, setSavedInputs] = useState({
    'annual-leave': {},
    'severance-pay': {},
    'overtime-pay': {}
  });

  const addToHistory = (calculation) => {
    const newCalculation = {
      id: Date.now(),
      timestamp: new Date(),
      ...calculation
    };
    const newHistory = [newCalculation, ...calculationHistory.slice(0, 9)];
    setCalculationHistory(newHistory);
  };

  const saveInputs = (calculatorId, inputs) => {
    const newSavedInputs = {
      ...savedInputs,
      [calculatorId]: inputs
    };
    setSavedInputs(newSavedInputs);
  };

  const loadInputs = (calculatorId) => {
    return savedInputs[calculatorId] || {};
  };

  return (
    <AppContext.Provider value={{
      user, setUser, isPremium, setIsPremium, calculationHistory, addToHistory, setCalculationHistory,
      currentPage, setCurrentPage, currentCalculator, setCurrentCalculator,
      isMobileMenuOpen, setIsMobileMenuOpen, notifications, setNotifications,
      savedInputs, saveInputs, loadInputs, isDark, toggleDarkMode
    }}>
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => useContext(AppContext);

// 계산기 데이터
const calculatorsData = {
  'annual-leave': {
    id: 'annual-leave', title: '연차계산기', description: '입사일 기준으로 정확한 연차 일수와 소멸 예정일을 계산해드립니다',
    icon: Calendar, color: 'from-green-500 to-green-600', category: 'vacation',
    related: ['severance-pay', 'overtime-pay'], premium: { price: 9900 }
  },
  'severance-pay': {
    id: 'severance-pay', title: '퇴직금계산기', description: '복잡한 수당까지 포함한 정밀한 퇴직금을 계산해드립니다',
    icon: DollarSign, color: 'from-orange-500 to-orange-600', category: 'salary',
    related: ['annual-leave', 'overtime-pay'], premium: { price: 14900 }
  },
  'overtime-pay': {
    id: 'overtime-pay', title: '야근수당계산기', description: '연장근로, 야간근로, 휴일근로 수당을 정확히 계산합니다',
    icon: Clock, color: 'from-purple-500 to-purple-600', category: 'salary',
    related: ['annual-leave', 'severance-pay'], premium: { price: 7900 }
  }
};

// ==================== UTILITIES ====================
const formatCurrency = (value) => {
  if (!value) return '';
  return parseInt(value).toLocaleString();
};

const tooltipInfo = {
  joinDate: '입사일은 근로계약서에 명시된 최초 입사일을 기준으로 합니다.',
  monthlySalary: '월 기본급은 세전 금액으로, 각종 수당은 제외된 기본 급여를 입력하세요.',
  bonus: '연간 상여금은 정기/비정기 상여금을 모두 포함한 1년간의 총액입니다.',
  usedLeave: '올해 사용한 연차 일수를 입력하세요. (반차는 0.5일로 계산)'
};

// ==================== COMMON COMPONENTS ====================
const DesktopButton = ({ children, variant = "primary", size = "md", onClick, disabled = false, className = "", fullWidth = false, ...props }) => {
  const baseClasses = "font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed",
    secondary: "border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800",
    success: "bg-green-600 text-white hover:bg-green-700",
    warning: "bg-amber-500 text-white hover:bg-amber-600",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 bg-white dark:bg-gray-800"
  };
  const sizes = {
    sm: "px-4 py-2 text-sm h-10",
    md: "px-6 py-3 text-base h-12",
    lg: "px-8 py-4 text-lg h-14"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

const DesktopInput = ({ label, type = "text", value, onChange, placeholder, required = false, tooltipKey, className = "", ...props }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {tooltipKey && (
          <div className="relative">
            <button 
              type="button" 
              onMouseEnter={() => setShowTooltip(true)} 
              onMouseLeave={() => setShowTooltip(false)} 
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <Info className="w-4 h-4" />
            </button>
            {showTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg whitespace-nowrap z-10 max-w-64 shadow-lg">
                {tooltipInfo[tooltipKey]}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
              </div>
            )}
          </div>
        )}
      </div>
      <input 
        type={type} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        className={`w-full px-4 py-3 text-base border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-white ${className}`}
        {...props} 
      />
    </div>
  );
};

// ==================== NAVIGATION ====================
const DesktopHeader = ({ navigateTo, currentCalculator }) => {
  const { isDark, toggleDarkMode, notifications } = useApp();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {currentCalculator ? (
              <button 
                onClick={() => navigateTo('home')} 
                className="flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="text-gray-600 dark:text-gray-300 font-medium">홈으로</span>
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">AI</span>
                </div>
                <div>
                  <h1 className="font-bold text-xl text-gray-900 dark:text-white">AI노무사</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">스마트 노무 관리 플랫폼</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <nav className="hidden lg:flex items-center space-x-2">
              {Object.values(calculatorsData).map((calc) => (
                <button
                  key={calc.id}
                  onClick={() => navigateTo(calc.id)}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    currentCalculator?.id === calc.id 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {calc.title}
                </button>
              ))}
            </nav>

            <div className="flex items-center space-x-2">
              <DarkModeToggle isDark={isDark} onToggle={toggleDarkMode} />
              <button className="relative p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// ==================== AI CONSULTATION ====================
const AIAdviceSection = ({ calculatorType, result, inputs }) => {
  const [advice, setAdvice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getAIAdvice = async () => {
    setIsLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      let aiAdvice = '';

      switch(calculatorType) {
        case 'annual-leave':
          if (result.available <= 2) {
            aiAdvice = `🚨 연차가 ${result.available}일밖에 남지 않았네요! 빠른 시일 내에 사용하시길 권장합니다. 연차는 소멸되면 복구가 어려우니, 미리 계획을 세워보세요. 연속 휴가보다는 월 1-2일씩 분산해서 사용하는 것도 좋은 방법입니다.`;
          } else if (result.available >= 10) {
            aiAdvice = `✨ 연차가 ${result.available}일이나 남았네요! 충분한 여유가 있습니다. 장기 휴가 계획을 세우시거나, 정기적인 휴식을 통해 워라밸을 개선해보세요. 다만 연말까지 모두 사용해야 하니 계획적으로 사용하시길 추천합니다.`;
          } else {
            aiAdvice = `👍 연차 사용이 적절한 수준입니다. 남은 ${result.available}일을 계획적으로 사용해보세요. 분기별로 1-2일씩 나누어 사용하면 지속적인 휴식이 가능합니다.`;
          }
          break;

        case 'severance-pay':
          const monthlyEquivalent = Math.floor(result.amount / result.workPeriod.years / 12);
          if (monthlyEquivalent > 3000000) {
            aiAdvice = `💰 퇴직금이 월 ${Math.floor(monthlyEquivalent/10000)}만원 수준으로 양호합니다! 퇴직소득세 절약을 위해 중간정산보다는 만기정산을 고려해보세요. 또한 퇴직연금 이전 시 세제혜택도 검토해보시길 권장합니다.`;
          } else {
            aiAdvice = `📋 현재 퇴직금 수준을 확인했습니다. 퇴직금 외에 실업급여, 건강보험 임의계속가입 등 추가 혜택도 챙기세요. 퇴직 시기와 방법에 따라 세금 부담이 달라질 수 있으니 전문가 상담을 받아보시는 것도 좋겠습니다.`;
          }
          break;

        case 'overtime-pay':
          const totalHours = (inputs.overtimeHours || 0) + (inputs.nightHours || 0) + (inputs.holidayHours || 0);
          if (totalHours > 20) {
            aiAdvice = `⚠️ 총 ${totalHours}시간의 추가근무는 과로 위험이 있습니다. 주 52시간 근로시간 상한을 확인해주세요. 건강을 위해 업무 효율성 개선이나 휴식 시간 확보를 권장합니다. 지속적인 야근은 번아웃으로 이어질 수 있어요.`;
          } else if (totalHours < 5) {
            aiAdvice = `👍 적정 수준의 추가근무네요. 현재 패턴을 유지하시면서, 추가 수당을 효율적으로 활용해보세요. 야근수당은 비과세 항목이 아니니 연말정산 시 고려하시기 바랍니다.`;
          } else {
            aiAdvice = `📊 일주일 ${totalHours}시간의 추가근무는 관리 가능한 수준입니다. 다만 지속적인 패턴 모니터링을 통해 건강한 근무환경을 유지하세요. 야간근무가 많다면 충분한 수면과 영양 관리가 중요합니다.`;
          }
          break;
      }

      setAdvice(aiAdvice);
    } catch (err) {
      setError('AI 조언을 가져오는데 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (result) {
      getAIAdvice();
    }
  }, [result]);

  if (!result) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-700 transition-colors">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">AI</span>
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-lg text-indigo-900 dark:text-indigo-200 mb-3 flex items-center">
            🤖 AI 노무사 조언
            <span className="ml-3 text-xs bg-indigo-200 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full">
              Beta
            </span>
          </h4>

          {isLoading ? (
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-indigo-700 dark:text-indigo-300">AI가 분석 중입니다...</span>
            </div>
          ) : error ? (
            <div className="text-red-600 dark:text-red-400">
              {error}
              <button 
                onClick={getAIAdvice}
                className="ml-3 text-indigo-600 dark:text-indigo-400 underline hover:no-underline"
              >
                다시 시도
              </button>
            </div>
          ) : advice ? (
            <p className="text-indigo-800 dark:text-indigo-200 leading-relaxed">{advice}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

// ==================== CALCULATORS ====================
const AnnualLeaveCalculator = () => {
  const { isPremium, addToHistory, saveInputs, loadInputs } = useApp();

  const savedData = loadInputs('annual-leave');
  const [joinDate, setJoinDate] = useState(savedData.joinDate || '');
  const [baseDate, setBaseDate] = useState(savedData.baseDate || new Date().toISOString().split('T')[0]);
  const [usedLeave, setUsedLeave] = useState(savedData.usedLeave || '');
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const inputs = { joinDate, baseDate, usedLeave };
    saveInputs('annual-leave', inputs);
  }, [joinDate, baseDate, usedLeave, saveInputs]);

  const calculateAnnualLeave = async () => {
    if (!joinDate || !baseDate) {
      alert('입사일과 기준일을 모두 입력해주세요.');
      return;
    }

    setIsCalculating(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const join = new Date(joinDate);
    const base = new Date(baseDate);
    const used = parseInt(usedLeave) || 0;

    const monthsDiff = (base.getFullYear() - join.getFullYear()) * 12 + (base.getMonth() - join.getMonth());

    let totalAnnualLeave = 0;
    if (monthsDiff >= 12) {
      totalAnnualLeave = 15;
      const additionalYears = Math.floor((monthsDiff - 12) / 12);
      totalAnnualLeave = Math.min(15 + additionalYears, 25);
    } else if (monthsDiff >= 1) {
      totalAnnualLeave = monthsDiff;
    }

    const finalResult = {
      total: totalAnnualLeave,
      used: used,
      available: Math.max(0, totalAnnualLeave - used),
      workPeriod: { years: Math.floor(monthsDiff / 12), months: monthsDiff % 12 }
    };

    setResult(finalResult);
    setIsCalculating(false);
    addToHistory({ type: 'annual-leave', input: { joinDate, baseDate, usedLeave }, result: finalResult });
  };

  const clearInputs = () => {
    if (confirm('입력된 값들을 모두 지우시겠습니까?')) {
      setJoinDate('');
      setBaseDate(new Date().toISOString().split('T')[0]);
      setUsedLeave('');
      setResult(null);
      saveInputs('annual-leave', {});
    }
  };

  return (
    <div className="space-y-8">
      {/* 계산 입력 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">연차 계산하기</h3>
            <p className="text-gray-500 dark:text-gray-400">정확한 연차 일수를 계산해드립니다</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <DesktopInput 
            label="입사일" 
            type="date" 
            value={joinDate} 
            onChange={(e) => setJoinDate(e.target.value)} 
            required 
            tooltipKey="joinDate" 
          />
          <DesktopInput 
            label="기준일" 
            type="date" 
            value={baseDate} 
            onChange={(e) => setBaseDate(e.target.value)} 
            required 
          />
          <DesktopInput 
            label="사용한 연차 (일)" 
            type="number" 
            value={usedLeave} 
            onChange={(e) => setUsedLeave(e.target.value)} 
            placeholder="예: 5일" 
            tooltipKey="usedLeave" 
          />
        </div>

        <div className="flex space-x-4">
          <DesktopButton 
            onClick={calculateAnnualLeave} 
            disabled={isCalculating} 
            size="lg" 
            className="flex-1"
            variant="success"
          >
            {isCalculating ? (
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>계산 중...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Calculator className="w-5 h-5" />
                <span>연차 계산하기</span>
              </div>
            )}
          </DesktopButton>

          <DesktopButton onClick={clearInputs} size="lg" variant="secondary">
            <X className="w-5 h-5" />
          </DesktopButton>
        </div>

        {(joinDate || usedLeave) && (
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/30 rounded-2xl p-4 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-blue-500" />
              <span className="text-blue-800 dark:text-blue-200 font-medium">입력값이 자동 저장되었습니다</span>
            </div>
          </div>
        )}
      </div>

      {/* 계산 결과 섹션 */}
      {result && (
        <div className="space-y-8">
          {/* 메인 결과 카드 */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-3xl p-8 border border-green-200 dark:border-green-700">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-3 bg-white dark:bg-gray-800 rounded-2xl px-6 py-3 shadow-sm mb-6">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span className="text-lg font-bold text-gray-900 dark:text-white">계산 완료</span>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border dark:border-gray-700 max-w-md mx-auto">
                <p className="text-gray-600 dark:text-gray-300 mb-2">사용 가능한 연차</p>
                <p className="text-6xl font-bold text-green-600 mb-4">{result.available}일</p>
                <div className="flex justify-center space-x-6 text-gray-600 dark:text-gray-300">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{result.total}</p>
                    <p className="text-sm">총 발생</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{result.used}</p>
                    <p className="text-sm">사용 완료</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{result.workPeriod.years}년</p>
                    <p className="text-sm">근속기간</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 차트 섹션 */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <InteractivePieChart 
              data={[
                { label: '사용 가능', value: result.available },
                { label: '사용 완료', value: result.used },
                { label: '미발생', value: Math.max(0, 25 - result.total) }
              ]}
              title="연차 현황 분석"
              centerText={`총 ${result.total}일`}
            />

            <AdvancedLineChart 
              data={[
                { month: '1년차', value: 15 },
                { month: '2년차', value: 16 },
                { month: '3년차', value: 17 },
                { month: '4년차', value: 18 },
                { month: '현재', value: result.total },
                { month: '최대', value: 25 }
              ]}
              title="연차 발생 추이"
              xKey="month"
              yKey="value"
              color="green"
            />
          </div>

          {/* AI 조언 섹션 */}
          <AIAdviceSection 
            calculatorType="annual-leave"
            result={result}
            inputs={{ joinDate, baseDate, usedLeave }}
          />
        </div>
      )}
    </div>
  );
};

const SeverancePayCalculator = () => {
  const { addToHistory, isPremium, saveInputs, loadInputs } = useApp();

  const savedData = loadInputs('severance-pay');
  const [joinDate, setJoinDate] = useState(savedData.joinDate || '');
  const [leaveDate, setLeaveDate] = useState(savedData.leaveDate || new Date().toISOString().split('T')[0]);
  const [monthlySalary, setMonthlySalary] = useState(savedData.monthlySalary || '');
  const [bonus, setBonus] = useState(savedData.bonus || '');
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const inputs = { joinDate, leaveDate, monthlySalary, bonus };
    saveInputs('severance-pay', inputs);
  }, [joinDate, leaveDate, monthlySalary, bonus, saveInputs]);

  const calculateSeverancePay = async () => {
    if (!joinDate || !leaveDate || !monthlySalary) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    setIsCalculating(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const join = new Date(joinDate);
    const leave = new Date(leaveDate);
    const salary = parseInt(monthlySalary.replace(/,/g, '')) || 0;
    const bonusAmount = parseInt(bonus.replace(/,/g, '')) || 0;

    const workDays = Math.floor((leave - join) / (1000 * 60 * 60 * 24));
    const workYears = workDays / 365;
    const averageWage = salary + (bonusAmount / 12);
    const severanceAmount = Math.floor(averageWage * 30 * workYears);

    const finalResult = {
      amount: severanceAmount,
      workPeriod: { days: workDays, years: Math.floor(workYears), months: Math.floor((workYears % 1) * 12) },
      averageWage, 
      details: { monthlySalary: salary, bonus: bonusAmount }
    };

    setResult(finalResult);
    setIsCalculating(false);
    addToHistory({ type: 'severance-pay', input: { joinDate, leaveDate, monthlySalary, bonus }, result: finalResult });
  };

  const clearInputs = () => {
    if (confirm('입력된 값들을 모두 지우시겠습니까?')) {
      setJoinDate('');
      setLeaveDate(new Date().toISOString().split('T')[0]);
      setMonthlySalary('');
      setBonus('');
      setResult(null);
      saveInputs('severance-pay', {});
    }
  };

  return (
    <div className="space-y-8">
      {/* 계산 입력 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">퇴직금 계산하기</h3>
            <p className="text-gray-500 dark:text-gray-400">정확한 퇴직금을 계산해드립니다</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <DesktopInput 
            label="입사일" 
            type="date" 
            value={joinDate} 
            onChange={(e) => setJoinDate(e.target.value)} 
            required 
            tooltipKey="joinDate" 
          />
          <DesktopInput 
            label="퇴사일" 
            type="date" 
            value={leaveDate} 
            onChange={(e) => setLeaveDate(e.target.value)} 
            required 
          />
          <DesktopInput 
            label="월 기본급" 
            type="text" 
            value={formatCurrency(monthlySalary)} 
            onChange={(e) => setMonthlySalary(e.target.value.replace(/,/g, ''))} 
            placeholder="예: 3,000,000원" 
            required 
            tooltipKey="monthlySalary" 
          />
          <DesktopInput 
            label="연간 상여금" 
            type="text" 
            value={formatCurrency(bonus)} 
            onChange={(e) => setBonus(e.target.value.replace(/,/g, ''))} 
            placeholder="예: 5,000,000원" 
            tooltipKey="bonus" 
          />
        </div>

        <div className="flex space-x-4">
          <DesktopButton 
            onClick={calculateSeverancePay} 
            disabled={isCalculating} 
            size="lg" 
            className="flex-1"
            variant="warning"
          >
            {isCalculating ? (
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>계산 중...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Calculator className="w-5 h-5" />
                <span>퇴직금 계산하기</span>
              </div>
            )}
          </DesktopButton>

          <DesktopButton onClick={clearInputs} size="lg" variant="secondary">
            <X className="w-5 h-5" />
          </DesktopButton>
        </div>

        {(joinDate || monthlySalary) && (
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/30 rounded-2xl p-4 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-blue-500" />
              <span className="text-blue-800 dark:text-blue-200 font-medium">입력값이 자동 저장되었습니다</span>
            </div>
          </div>
        )}
      </div>

      {/* 계산 결과 섹션 */}
      {result && (
        <div className="space-y-8">
          {/* 메인 결과 카드 */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 rounded-3xl p-8 border border-orange-200 dark:border-orange-700">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-3 bg-white dark:bg-gray-800 rounded-2xl px-6 py-3 shadow-sm mb-6">
                <CheckCircle className="w-6 h-6 text-orange-500" />
                <span className="text-lg font-bold text-gray-900 dark:text-white">계산 완료</span>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border dark:border-gray-700 max-w-md mx-auto">
                <p className="text-gray-600 dark:text-gray-300 mb-2">예상 퇴직금</p>
                <p className="text-5xl font-bold text-orange-600 mb-4">{result.amount.toLocaleString()}원</p>
                <div className="flex justify-center space-x-6 text-gray-600 dark:text-gray-300">
                  <div className="text-center">
                    <p className="text-xl font-bold">{result.workPeriod.years}년</p>
                    <p className="text-sm">근속기간</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">{Math.floor(result.averageWage).toLocaleString()}원</p>
                    <p className="text-sm">평균임금</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 차트 섹션 */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <InteractivePieChart 
              data={[
                { label: '기본급 기반', value: Math.floor(result.details.monthlySalary * 30 * (result.workPeriod.days / 365)) },
                { label: '상여금 기반', value: Math.floor((result.details.bonus / 12) * 30 * (result.workPeriod.days / 365)) }
              ]}
              title="퇴직금 구성 분석"
              centerText={`총 ${Math.floor(result.amount / 10000)}만원`}
            />

            <AdvancedLineChart 
              data={[
                { year: '1년차', value: result.details.monthlySalary * 12 },
                { year: '2년차', value: result.details.monthlySalary * 24 },
                { year: '3년차', value: result.details.monthlySalary * 36 },
                { year: '현재', value: result.amount }
              ]}
              title="퇴직금 누적 추이"
              xKey="year"
              yKey="value"
              color="orange"
            />
          </div>

          {/* AI 조언 섹션 */}
          <AIAdviceSection 
            calculatorType="severance-pay"
            result={result}
            inputs={{ joinDate, leaveDate, monthlySalary, bonus }}
          />
        </div>
      )}
    </div>
  );
};

const OvertimePayCalculator = () => {
  const { addToHistory, isPremium, saveInputs, loadInputs } = useApp();
  
  const savedData = loadInputs('overtime-pay');
  const [hourlySalary, setHourlySalary] = useState(savedData.hourlySalary || '');
  const [overtimeHours, setOvertimeHours] = useState(savedData.overtimeHours || '');
  const [nightHours, setNightHours] = useState(savedData.nightHours || '');
  const [holidayHours, setHolidayHours] = useState(savedData.holidayHours || '');
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const inputs = { hourlySalary, overtimeHours, nightHours, holidayHours };
    saveInputs('overtime-pay', inputs);
  }, [hourlySalary, overtimeHours, nightHours, holidayHours, saveInputs]);

  const calculateOvertimePay = async () => {
    if (!hourlySalary) {
      alert('시급을 입력해주세요.');
      return;
    }

    setIsCalculating(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const hourlyRate = parseInt(hourlySalary.replace(/,/g, '')) || 0;
    const overtime = parseInt(overtimeHours) || 0;
    const night = parseInt(nightHours) || 0;
    const holiday = parseInt(holidayHours) || 0;

    const overtimePay = overtime * hourlyRate * 1.5;
    const nightPay = night * hourlyRate * 1.5;
    const holidayPay = holiday <= 8 ? holiday * hourlyRate * 1.5 : (8 * hourlyRate * 1.5) + ((holiday - 8) * hourlyRate * 2);
    const totalAllowance = overtimePay + nightPay + holidayPay;

    const finalResult = {
      totalAllowance, 
      breakdown: { overtime: overtimePay, night: nightPay, holiday: holidayPay },
      hours: { overtime, night, holiday }, 
      hourlyRate
    };

    setResult(finalResult);
    setIsCalculating(false);
    addToHistory({ type: 'overtime-pay', input: { hourlySalary, overtimeHours, nightHours, holidayHours }, result: finalResult });
  };

  const clearInputs = () => {
    if (confirm('입력된 값들을 모두 지우시겠습니까?')) {
      setHourlySalary('');
      setOvertimeHours('');
      setNightHours('');
      setHolidayHours('');
      setResult(null);
      saveInputs('overtime-pay', {});
    }
  };

  return (
    <div className="space-y-8">
      {/* 계산 입력 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">야근수당 계산하기</h3>
            <p className="text-gray-500 dark:text-gray-400">연장근로, 야간근로, 휴일근로 수당을 계산해드립니다</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DesktopInput 
            label="시급" 
            type="text" 
            value={formatCurrency(hourlySalary)} 
            onChange={(e) => setHourlySalary(e.target.value.replace(/,/g, ''))} 
            placeholder="예: 15,000원" 
            required 
          />
          <DesktopInput 
            label="연장근로 (시간)" 
            type="number" 
            value={overtimeHours} 
            onChange={(e) => setOvertimeHours(e.target.value)} 
            placeholder="예: 10시간" 
          />
          <DesktopInput 
            label="야간근로 (시간)" 
            type="number" 
            value={nightHours} 
            onChange={(e) => setNightHours(e.target.value)} 
            placeholder="예: 5시간" 
          />
          <DesktopInput 
            label="휴일근로 (시간)" 
            type="number" 
            value={holidayHours} 
            onChange={(e) => setHolidayHours(e.target.value)} 
            placeholder="예: 8시간" 
          />
        </div>

        <div className="flex space-x-4">
          <DesktopButton 
            onClick={calculateOvertimePay} 
            disabled={isCalculating} 
            size="lg" 
            className="flex-1"
            variant="primary"
          >
            {isCalculating ? (
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>계산 중...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Calculator className="w-5 h-5" />
                <span>야근수당 계산하기</span>
              </div>
            )}
          </DesktopButton>

          <DesktopButton onClick={clearInputs} size="lg" variant="secondary">
            <X className="w-5 h-5" />
          </DesktopButton>
        </div>
      </div>

      {/* 계산 결과 섹션 */}
      {result && (
        <div className="space-y-8">
          {/* 메인 결과 카드 */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-3xl p-8 border border-purple-200 dark:border-purple-700">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-3 bg-white dark:bg-gray-800 rounded-2xl px-6 py-3 shadow-sm mb-6">
                <CheckCircle className="w-6 h-6 text-purple-500" />
                <span className="text-lg font-bold text-gray-900 dark:text-white">계산 완료</span>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border dark:border-gray-700 max-w-md mx-auto">
                <p className="text-gray-600 dark:text-gray-300 mb-2">총 수당</p>
                <p className="text-5xl font-bold text-purple-600 mb-4">{result.totalAllowance.toLocaleString()}원</p>
                <div className="grid grid-cols-3 gap-4 text-gray-600 dark:text-gray-300">
                  {result.breakdown.overtime > 0 && (
                    <div className="text-center">
                      <p className="text-lg font-bold">{result.breakdown.overtime.toLocaleString()}</p>
                      <p className="text-xs">연장근로</p>
                    </div>
                  )}
                  {result.breakdown.night > 0 && (
                    <div className="text-center">
                      <p className="text-lg font-bold">{result.breakdown.night.toLocaleString()}</p>
                      <p className="text-xs">야간근로</p>
                    </div>
                  )}
                  {result.breakdown.holiday > 0 && (
                    <div className="text-center">
                      <p className="text-lg font-bold">{result.breakdown.holiday.toLocaleString()}</p>
                      <p className="text-xs">휴일근로</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 차트 섹션 */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <InteractivePieChart 
              data={[
                ...(result.breakdown.overtime > 0 ? [{ label: '연장근로', value: result.breakdown.overtime }] : []),
                ...(result.breakdown.night > 0 ? [{ label: '야간근로', value: result.breakdown.night }] : []),
                ...(result.breakdown.holiday > 0 ? [{ label: '휴일근로', value: result.breakdown.holiday }] : [])
              ].filter(item => item.value > 0)}
              title="수당 구성 분석"
              centerText={`${Math.floor(result.totalAllowance / 10000)}만원`}
            />

            <AdvancedLineChart 
              data={[
                { week: '1주차', value: result.breakdown.overtime * 0.3 },
                { week: '2주차', value: result.breakdown.overtime * 0.6 },
                { week: '3주차', value: result.breakdown.overtime * 0.9 },
                { week: '4주차', value: result.breakdown.overtime }
              ]}
              title="주간 야근 패턴"
              xKey="week"
              yKey="value"
              color="purple"
            />
          </div>

          {/* AI 조언 섹션 */}
          <AIAdviceSection 
            calculatorType="overtime-pay"
            result={result}
            inputs={{ hourlySalary, overtimeHours, nightHours, holidayHours }}
          />
        </div>
      )}
    </div>
  );
};

// ==================== HISTORY ====================
const CalculationHistory = () => {
  const { calculationHistory, setCalculationHistory } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const getTypeLabel = (type) => ({ 
    'annual-leave': '연차계산', 
    'severance-pay': '퇴직금계산', 
    'overtime-pay': '야근수당계산' 
  }[type] || type);

  const getResultDisplay = (item) => {
    switch (item.type) {
      case 'annual-leave': return `${item.result.available}일`;
      case 'severance-pay': return `${(item.result.amount || 0).toLocaleString()}원`;
      case 'overtime-pay': return `${(item.result.totalAllowance || 0).toLocaleString()}원`;
      default: return '-';
    }
  };

  const filteredHistory = calculationHistory.filter(item => {
    const matchesSearch = searchTerm === '' || 
      getTypeLabel(item.type).toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.timestamp.toLocaleDateString('ko-KR').includes(searchTerm);
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  if (calculationHistory.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border dark:border-gray-700 text-center">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">계산 이력이 없습니다</h4>
        <p className="text-gray-500 dark:text-gray-400">계산기를 사용하면 이력이 저장됩니다</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">계산 이력</h3>
        <button 
          onClick={() => setCalculationHistory([])} 
          className="text-sm text-gray-400 hover:text-red-500 transition-colors"
        >
          전체삭제
        </button>
      </div>

      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="이력 검색..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 transition-colors dark:bg-gray-700 dark:text-white" 
          />
        </div>
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)} 
          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 transition-colors dark:bg-gray-700 dark:text-white"
        >
          <option value="all">전체 보기</option>
          <option value="annual-leave">연차계산</option>
          <option value="severance-pay">퇴직금계산</option>
          <option value="overtime-pay">야근수당계산</option>
        </select>
      </div>

      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">검색 결과가 없습니다</p>
          </div>
        ) : (
          filteredHistory.slice(0, 10).map((item) => (
            <div 
              key={item.id} 
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-1">
                  <p className="font-semibold text-gray-900 dark:text-white">{getTypeLabel(item.type)}</p>
                  <span className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200 px-3 py-1 rounded-full">
                    {item.timestamp.toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-600 dark:text-blue-400">{getResultDisplay(item)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ==================== PWA FUNCTIONALITY ====================
const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    const checkIfInstalled = () => {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    checkIfInstalled();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      const result = await deferredPrompt.prompt();
      if (result.outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } catch (error) {
      console.error('PWA 설치 실패:', error);
    }
  };

  if (isInstalled) {
    return (
      <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-2xl p-6 transition-colors">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-lg text-green-900 dark:text-green-200">앱 설치 완료!</h4>
            <p className="text-green-700 dark:text-green-300">AI노무사가 홈 화면에 추가되었습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isInstallable && !isInstalled) {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      return (
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-2xl p-6 transition-colors">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">📱</span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg text-blue-900 dark:text-blue-200">앱으로 설치하기</h4>
              <p className="text-blue-700 dark:text-blue-300">Safari에서 홈 화면에 추가할 수 있어요</p>
            </div>
            <DesktopButton 
              onClick={() => alert('📱 iPhone/iPad에서 설치하기:\n\n1. Safari에서 이 페이지를 엽니다\n2. 하단의 공유 버튼(⬆️)을 탭합니다\n3. "홈 화면에 추가"를 선택합니다\n4. "추가"를 탭하면 완료!')} 
              size="sm" 
              variant="primary"
            >
              방법 보기
            </DesktopButton>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200 dark:border-purple-700 rounded-2xl p-6 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
          <span className="text-white font-bold text-xl">📱</span>
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-lg text-purple-900 dark:text-purple-200">앱으로 설치하기</h4>
          <p className="text-purple-700 dark:text-purple-300">홈 화면에 추가해서 더 빠르게 이용하세요!</p>
        </div>
        <DesktopButton 
          onClick={handleInstallClick} 
          size="sm" 
          variant="primary" 
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          <Download className="w-4 h-4 mr-2" />
          설치
        </DesktopButton>
      </div>
    </div>
  );
};

// ==================== MAIN APP ====================
const EnhancedAILaborPlatform = () => {
  const { currentPage, currentCalculator, setCurrentPage, setCurrentCalculator } = useApp();

  // PWA 초기화
  useEffect(() => {
    const addManifest = () => {
      const manifest = {
        name: "AI노무사 - 스마트 노무 관리",
        short_name: "AI노무사",
        description: "AI 기술로 더 쉽고 정확한 노무 업무를 경험하세요",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#2563eb",
        orientation: "portrait-primary",
        icons: [
          {
            src: "data:image/svg+xml;base64," + btoa(`
              <svg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
                <rect width="192" height="192" fill="#2563eb" rx="32"/>
                <text x="96" y="120" font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="white" text-anchor="middle">AI</text>
              </svg>
            `),
            sizes: "192x192",
            type: "image/svg+xml"
          }
        ]
      };

      const manifestBlob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
      const manifestURL = URL.createObjectURL(manifestBlob);

      const linkElement = document.createElement('link');
      linkElement.rel = 'manifest';
      linkElement.href = manifestURL;
      document.head.appendChild(linkElement);

      const addMetaTag = (name, content) => {
        if (!document.querySelector(`meta[name="${name}"]`)) {
          const meta = document.createElement('meta');
          meta.name = name;
          meta.content = content;
          document.head.appendChild(meta);
        }
      };

      addMetaTag('apple-mobile-web-app-capable', 'yes');
      addMetaTag('apple-mobile-web-app-status-bar-style', 'default');
      addMetaTag('apple-mobile-web-app-title', 'AI노무사');
      addMetaTag('mobile-web-app-capable', 'yes');
      addMetaTag('application-name', 'AI노무사');
    };

    addManifest();
  }, []);

  const navigateTo = (page) => {
    setCurrentPage(page);
    if (page === 'home') {
      setCurrentCalculator(null);
    } else if (calculatorsData[page]) {
      setCurrentCalculator(calculatorsData[page]);
    }
  };

  const renderCalculator = () => {
    if (!currentCalculator) return null;
    switch (currentCalculator.id) {
      case 'annual-leave': return <AnnualLeaveCalculator />;
      case 'severance-pay': return <SeverancePayCalculator />;
      case 'overtime-pay': return <OvertimePayCalculator />;
      default: return <div>계산기를 준비 중입니다.</div>;
    }
  };

  // 계산기 페이지
  if (currentCalculator) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <DesktopHeader navigateTo={navigateTo} currentCalculator={currentCalculator} />
        <main className="max-w-7xl mx-auto p-6 pb-8">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            <div className="xl:col-span-3">{renderCalculator()}</div>
            <div className="space-y-6">
              <CalculationHistory />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 홈페이지
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <DesktopHeader navigateTo={navigateTo} currentCalculator={null} />

      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              스마트한 노무 관리의<br />
              <span className="bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">새로운 기준</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 leading-relaxed">
              AI 기술로 더 쉽고 정확한 노무 업무를 경험하세요.<br />
              복잡한 계산부터 전문적인 조언까지, 모든 것을 한 곳에서.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <DesktopButton 
                onClick={() => navigateTo('annual-leave')} 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
              >
                <Calendar className="w-5 h-5 mr-2" />
                연차계산 시작하기
              </DesktopButton>
              <DesktopButton 
                onClick={() => navigateTo('severance-pay')} 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                <DollarSign className="w-5 h-5 mr-2" />
                퇴직금 계산하기
              </DesktopButton>
            </div>

            {/* 핵심 기능 소개 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⚡</span>
                </div>
                <h3 className="font-bold text-lg mb-2">빠른 계산</h3>
                <p className="text-blue-100 text-sm">복잡한 노무 계산도 1초 만에 완료</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🤖</span>
                </div>
                <h3 className="font-bold text-lg mb-2">AI 조언</h3>
                <p className="text-blue-100 text-sm">계산 결과에 맞는 전문적인 조언 제공</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="font-bold text-lg mb-2">시각화</h3>
                <p className="text-blue-100 text-sm">인터랙티브 차트로 한눈에 이해</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 계산기 섹션 */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* PWA 설치 프롬프트 */}
          <div className="mb-12">
            <PWAInstallPrompt />
          </div>

          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">노무 계산기</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">필요한 모든 노무 계산을 한 곳에서 해결하세요</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {Object.values(calculatorsData).map((calc) => {
              const IconComponent = calc.icon;
              return (
                <div 
                  key={calc.id} 
                  onClick={() => navigateTo(calc.id)} 
                  className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${calc.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{calc.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{calc.description}</p>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-2 transition-transform">
                    <span>계산하기</span>
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">AI노무사</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            스마트한 노무 관리로 더 나은 근무 환경을 만들어가세요
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <span>© 2025 AI노무사</span>
            <span>•</span>
            <span>개인정보처리방침</span>
            <span>•</span>
            <span>이용약관</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <EnhancedAILaborPlatform />
    </AppProvider>
  );
};

export default App;