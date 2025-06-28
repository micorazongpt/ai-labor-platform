import React, { useState, useEffect, createContext, useContext } from 'react';
import { Calculator, Clock, DollarSign, Calendar, Heart, Shield, FileText, TrendingUp, Users, Award, ChevronRight, ArrowLeft, Home, Download, Star, Lock, Crown, BarChart3, AlertCircle, CheckCircle, Info, Menu, X, Search, Bell, User } from 'lucide-react';

// ==================== ADVANCED CHARTS ====================
const AdvancedLineChart = ({ data, title, xKey, yKey, color = "blue" }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const maxValue = Math.max(...data.map(d => d[yKey]));
  const minValue = Math.min(...data.map(d => d[yKey]));
  const range = maxValue - minValue;

  const getPath = () => {
    const width = 300;
    const height = 120;
    const padding = 20;

    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * (width - 2 * padding) + padding;
      const y = height - padding - ((item[yKey] - minValue) / range) * (height - 2 * padding);
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  const getGradientPath = () => {
    const width = 300;
    const height = 120;
    const padding = 20;

    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * (width - 2 * padding) + padding;
      const y = height - padding - ((item[yKey] - minValue) / range) * (height - 2 * padding);
      return `${x},${y}`;
    });

    return `M ${padding},${height - padding} L ${points.join(' L ')} L ${300 - padding},${height - padding} Z`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border dark:border-gray-700 transition-colors">
      <h5 className="font-semibold text-gray-900 dark:text-white mb-4">{title}</h5>
      <div className="relative">
        <svg width="300" height="120" className="overflow-visible">
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" className={`text-${color}-400`} style={{stopColor: 'currentColor', stopOpacity: 0.3}} />
              <stop offset="100%" className={`text-${color}-400`} style={{stopColor: 'currentColor', stopOpacity: 0.05}} />
            </linearGradient>
          </defs>

          {/* 그리드 라인 */}
          {[0, 1, 2, 3, 4].map(i => (
            <line 
              key={i}
              x1="20" 
              y1={20 + (i * 20)} 
              x2="280" 
              y2={20 + (i * 20)}
              stroke="currentColor" 
              className="text-gray-200 dark:text-gray-600"
              strokeWidth="0.5"
            />
          ))}

          {/* 그라데이션 영역 */}
          <path
            d={getGradientPath()}
            fill={`url(#gradient-${color})`}
            className="transition-all duration-500"
          />

          {/* 메인 라인 */}
          <path
            d={getPath()}
            fill="none"
            stroke="currentColor"
            className={`text-${color}-500 transition-all duration-500`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 데이터 포인트 */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 260 + 20;
            const y = 100 - ((item[yKey] - minValue) / range) * 80 + 20;

            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r={hoveredPoint === index ? "6" : "4"}
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
          <div className="absolute top-0 left-0 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded px-2 py-1 pointer-events-none z-10 transform -translate-x-1/2 -translate-y-full">
            {data[hoveredPoint][xKey]}: {data[hoveredPoint][yKey].toLocaleString()}
          </div>
        )}
      </div>

      {/* 범례 */}
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
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
    const x1 = Math.cos((startAngle * Math.PI) / 180) * 50;
    const y1 = Math.sin((startAngle * Math.PI) / 180) * 50;
    const x2 = Math.cos((endAngle * Math.PI) / 180) * 50;
    const y2 = Math.sin((endAngle * Math.PI) / 180) * 50;

    const pathData = [
      `M 50 50`,
      `L ${50 + x1} ${50 + y1}`,
      `A 50 50 0 ${isLarge} 1 ${50 + x2} ${50 + y2}`,
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
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border dark:border-gray-700 transition-colors">
      <h5 className="font-semibold text-gray-900 dark:text-white mb-4 text-center">{title}</h5>

      <div className="flex items-center justify-center mb-4">
        <div className="relative">
          <svg width="200" height="200" viewBox="0 0 100 100" className="transform -rotate-90">
            {segments.map((segment, index) => (
              <path
                key={index}
                d={segment.pathData}
                fill="currentColor"
                className={`${segment.color} cursor-pointer transition-all duration-300 ${
                  hoveredSegment === index ? 'opacity-80 transform scale-105' : 'opacity-70'
                }`}
                onMouseEnter={() => setHoveredSegment(index)}
                onMouseLeave={() => setHoveredSegment(null)}
                style={{
                  transformOrigin: '50px 50px',
                  filter: hoveredSegment === index ? 'brightness(1.1)' : 'none'
                }}
              />
            ))}
          </svg>

          {/* 중앙 텍스트 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-white">{centerText}</div>
              {hoveredSegment !== null && (
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {segments[hoveredSegment].percentage}%
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 범례 */}
      <div className="space-y-2">
        {segments.map((segment, index) => (
          <div 
            key={index} 
            className={`flex items-center justify-between p-2 rounded transition-colors cursor-pointer ${
              hoveredSegment === index ? 'bg-gray-50 dark:bg-gray-700' : ''
            }`}
            onMouseEnter={() => setHoveredSegment(index)}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${segment.color.replace('text-', 'bg-')}`}></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">{segment.label}</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {typeof segment.value === 'number' ? segment.value.toLocaleString() : segment.value}
              </div>
              <div className="text-xs text-gray-500">{segment.percentage}%</div>
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
    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    title={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
  >
    {isDark ? (
      <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">☀️</div>
    ) : (
      <div className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center">🌙</div>
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
const MobileOptimizedButton = ({ children, variant = "primary", size = "md", onClick, disabled = false, className = "", ...props }) => {
  const baseClasses = "font-medium rounded-xl transition-all duration-200 flex items-center justify-center";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300",
    secondary: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
    success: "bg-green-600 text-white hover:bg-green-700",
    warning: "bg-amber-500 text-white hover:bg-amber-600"
  };
  const sizes = {
    sm: "px-3 py-2 text-sm min-h-[40px]",
    md: "px-4 py-3 text-base min-h-[48px]",
    lg: "px-6 py-4 text-lg min-h-[56px]"
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const MobileOptimizedInput = ({ label, type = "text", value, onChange, placeholder, required = false, tooltipKey, ...props }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {tooltipKey && (
          <div className="relative">
            <button type="button" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)} onClick={() => setShowTooltip(!showTooltip)} className="text-gray-400 hover:text-gray-600">
              <Info className="w-4 h-4" />
            </button>
            {showTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10 max-w-64">
                {tooltipInfo[tooltipKey]}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            )}
          </div>
        )}
      </div>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" style={{ fontSize: '16px' }} {...props} />
    </div>
  );
};

const PremiumBadge = () => (
  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-400 to-amber-500 text-white">
    <Crown className="w-3 h-3 mr-1" />Premium
  </span>
);

// ==================== NAVIGATION ====================
const MobileNavigation = ({ isOpen, onClose, navigateTo }) => {
  const { notifications, isPremium } = useApp();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">AI노무사</span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">계산기</h3>
              <nav className="space-y-2">
                {Object.values(calculatorsData).map((calc) => {
                  const IconComponent = calc.icon;
                  return (
                    <button key={calc.id} onClick={() => { navigateTo(calc.id); onClose(); }} className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                      <div className={`w-8 h-8 bg-gradient-to-br ${calc.color} rounded-lg flex items-center justify-center`}>
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{calc.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{calc.description}</p>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MobileHeader = ({ onMenuOpen, navigateTo, currentCalculator }) => {
  const { isDark, toggleDarkMode, notifications } = useApp();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-colors">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {currentCalculator ? (
              <>
                <button onClick={() => navigateTo('home')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
                <div className="flex items-center space-x-2">
                  <div className={`w-7 h-7 bg-gradient-to-br ${currentCalculator.color} rounded-md flex items-center justify-center`}>
                    <currentCalculator.icon className="w-3 h-3 text-white" />
                  </div>
                  <h1 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">{currentCalculator.title}</h1>
                </div>
              </>
            ) : (
              <>
                <button onClick={onMenuOpen} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg lg:hidden transition-colors">
                  <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-xs">AI</span>
                  </div>
                  <h1 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">AI노무사</h1>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <DarkModeToggle isDark={isDark} onToggle={toggleDarkMode} />
            <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
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
      // 실제 Claude API 연동 시뮬레이션
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
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl p-4 border border-indigo-200 dark:border-indigo-700 transition-colors">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">AI</span>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-2 flex items-center">
            🤖 AI 노무사 조언
            <span className="ml-2 text-xs bg-indigo-200 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded-full">
              Beta
            </span>
          </h4>

          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-indigo-700 dark:text-indigo-300">AI가 분석 중입니다...</span>
            </div>
          ) : error ? (
            <div className="text-sm text-red-600 dark:text-red-400">
              {error}
              <button 
                onClick={getAIAdvice}
                className="ml-2 text-indigo-600 dark:text-indigo-400 underline hover:no-underline"
              >
                다시 시도
              </button>
            </div>
          ) : advice ? (
            <p className="text-sm text-indigo-800 dark:text-indigo-200 leading-relaxed">{advice}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

// ==================== CALCULATORS ====================
const AnnualLeaveCalculator = () => {
  const { isPremium, addToHistory, saveInputs, loadInputs } = useApp();

  // 저장된 입력값 불러오기
  const savedData = loadInputs('annual-leave');
  const [joinDate, setJoinDate] = useState(savedData.joinDate || '');
  const [baseDate, setBaseDate] = useState(savedData.baseDate || new Date().toISOString().split('T')[0]);
  const [usedLeave, setUsedLeave] = useState(savedData.usedLeave || '');
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // 입력값 변경 시 자동 저장
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
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <h3 className="text-xl font-semibold mb-6 text-center text-gray-900 dark:text-white transition-colors">연차 계산하기</h3>
        <div className="space-y-5">
          <MobileOptimizedInput label="입사일" type="date" value={joinDate} onChange={(e) => setJoinDate(e.target.value)} required tooltipKey="joinDate" />
          <MobileOptimizedInput label="기준일" type="date" value={baseDate} onChange={(e) => setBaseDate(e.target.value)} required />
          <MobileOptimizedInput label="사용한 연차 (일)" type="number" value={usedLeave} onChange={(e) => setUsedLeave(e.target.value)} placeholder="예: 5일" tooltipKey="usedLeave" />

          <div className="flex space-x-3">
            <MobileOptimizedButton onClick={calculateAnnualLeave} disabled={isCalculating} size="lg" className="flex-1" variant="success">
              {isCalculating ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>계산 중...</span>
                </div>
              ) : '연차 계산하기'}
            </MobileOptimizedButton>

            <MobileOptimizedButton onClick={clearInputs} size="lg" variant="secondary" className="px-4">
              <X className="w-4 h-4" />
            </MobileOptimizedButton>
          </div>

          {(joinDate || usedLeave) && (
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-800 dark:text-blue-200">입력값이 자동 저장되었습니다</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {result && (
        <div id="calculation-result" className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl p-6 border border-green-200 dark:border-green-700">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-semibold text-green-800 dark:text-green-200 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />계산 완료
            </h4>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm text-center mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">사용 가능한 연차</p>
            <p className="text-4xl font-bold text-green-600 mb-2">{result.available}일</p>
            <div className="flex justify-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
              <span>총 {result.total}일</span>
              <span>사용 {result.used}일</span>
            </div>
          </div>

          {/* 연차 사용 현황 차트 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <InteractivePieChart 
              data={[
                { label: '사용 가능', value: result.available },
                { label: '사용 완료', value: result.used },
                { label: '미발생', value: Math.max(0, 25 - result.total) }
              ]}
              title="연차 현황"
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
          <div className="mt-6">
            <AIAdviceSection 
              calculatorType="annual-leave"
              result={result}
              inputs={{ joinDate, baseDate, usedLeave }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const SeverancePayCalculator = () => {
  const { addToHistory, isPremium, saveInputs, loadInputs } = useApp();

  // 저장된 입력값 불러오기
  const savedData = loadInputs('severance-pay');
  const [joinDate, setJoinDate] = useState(savedData.joinDate || '');
  const [leaveDate, setLeaveDate] = useState(savedData.leaveDate || new Date().toISOString().split('T')[0]);
  const [monthlySalary, setMonthlySalary] = useState(savedData.monthlySalary || '');
  const [bonus, setBonus] = useState(savedData.bonus || '');
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // 입력값 변경 시 자동 저장
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
      averageWage, details: { monthlySalary: salary, bonus: bonusAmount }
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
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-6 text-center text-gray-900 dark:text-white">퇴직금 계산하기</h3>
        <div className="space-y-5">
          <MobileOptimizedInput label="입사일" type="date" value={joinDate} onChange={(e) => setJoinDate(e.target.value)} required tooltipKey="joinDate" />
          <MobileOptimizedInput label="퇴사일" type="date" value={leaveDate} onChange={(e) => setLeaveDate(e.target.value)} required />
          <MobileOptimizedInput label="월 기본급" type="text" value={formatCurrency(monthlySalary)} onChange={(e) => setMonthlySalary(e.target.value.replace(/,/g, ''))} placeholder="예: 3,000,000원" required tooltipKey="monthlySalary" />
          <MobileOptimizedInput label="연간 상여금" type="text" value={formatCurrency(bonus)} onChange={(e) => setBonus(e.target.value.replace(/,/g, ''))} placeholder="예: 5,000,000원" tooltipKey="bonus" />

          <div className="flex space-x-3">
            <MobileOptimizedButton onClick={calculateSeverancePay} disabled={isCalculating} size="lg" className="flex-1" variant="warning">
              {isCalculating ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>계산 중...</span>
                </div>
              ) : '퇴직금 계산하기'}
            </MobileOptimizedButton>

            <MobileOptimizedButton onClick={clearInputs} size="lg" variant="secondary" className="px-4">
              <X className="w-4 h-4" />
            </MobileOptimizedButton>
          </div>

          {(joinDate || monthlySalary) && (
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-800 dark:text-blue-200">입력값이 자동 저장되었습니다</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {result && (
        <div id="severance-result" className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 rounded-2xl p-6 border border-orange-200 dark:border-orange-700">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-semibold text-orange-800 dark:text-orange-200 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />계산 완료
            </h4>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm text-center mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">예상 퇴직금</p>
            <p className="text-4xl font-bold text-orange-600 mb-2">{result.amount.toLocaleString()}원</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">근속 {result.workPeriod.years}년 {result.workPeriod.months}개월</p>
          </div>

          {/* 퇴직금 구성 차트 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <InteractivePieChart 
              data={[
                { label: '기본급 기반', value: Math.floor(result.details.monthlySalary * 30 * (result.workPeriod.days / 365)) },
                { label: '상여금 기반', value: Math.floor((result.details.bonus / 12) * 30 * (result.workPeriod.days / 365)) }
              ]}
              title="퇴직금 구성"
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

          <div className="mt-6">
            <AIAdviceSection 
              calculatorType="severance-pay"
              result={result}
              inputs={{ joinDate, leaveDate, monthlySalary, bonus }}
            />
          </div>
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
    await new Promise(resolve => setTimeout(resolve, 500));

    const hourlyRate = parseInt(hourlySalary.replace(/,/g, '')) || 0;
    const overtime = parseInt(overtimeHours) || 0;
    const night = parseInt(nightHours) || 0;
    const holiday = parseInt(holidayHours) || 0;

    const overtimePay = overtime * hourlyRate * 1.5;
    const nightPay = night * hourlyRate * 1.5;
    const holidayPay = holiday <= 8 ? holiday * hourlyRate * 1.5 : (8 * hourlyRate * 1.5) + ((holiday - 8) * hourlyRate * 2);
    const totalAllowance = overtimePay + nightPay + holidayPay;

    const finalResult = {
      totalAllowance, breakdown: { overtime: overtimePay, night: nightPay, holiday: holidayPay },
      hours: { overtime, night, holiday }, hourlyRate
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
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-6 text-center text-gray-900 dark:text-white">야근수당 계산하기</h3>
        <div className="space-y-5">
          <MobileOptimizedInput label="시급" type="text" value={formatCurrency(hourlySalary)} onChange={(e) => setHourlySalary(e.target.value.replace(/,/g, ''))} placeholder="예: 15,000원" required />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MobileOptimizedInput label="연장근로 (시간)" type="number" value={overtimeHours} onChange={(e) => setOvertimeHours(e.target.value)} placeholder="예: 10시간" />
            <MobileOptimizedInput label="야간근로 (시간)" type="number" value={nightHours} onChange={(e) => setNightHours(e.target.value)} placeholder="예: 5시간" />
            <MobileOptimizedInput label="휴일근로 (시간)" type="number" value={holidayHours} onChange={(e) => setHolidayHours(e.target.value)} placeholder="예: 8시간" />
          </div>

          <div className="flex space-x-3">
            <MobileOptimizedButton onClick={calculateOvertimePay} disabled={isCalculating} size="lg" className="flex-1" variant="primary">
              {isCalculating ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>계산 중...</span>
                </div>
              ) : '야근수당 계산하기'}
            </MobileOptimizedButton>

            <MobileOptimizedButton onClick={clearInputs} size="lg" variant="secondary" className="px-4">
              <X className="w-4 h-4" />
            </MobileOptimizedButton>
          </div>
        </div>
      </div>

      {result && (
        <div id="overtime-result" className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-2xl p-6 border border-purple-200 dark:border-purple-700">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-semibold text-purple-800 dark:text-purple-200 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />계산 완료
            </h4>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm text-center mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">총 수당</p>
            <p className="text-4xl font-bold text-purple-600 mb-2">{result.totalAllowance.toLocaleString()}원</p>
          </div>

          {/* 야근수당 구성 차트 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <InteractivePieChart 
              data={[
                ...(result.breakdown.overtime > 0 ? [{ label: '연장근로', value: result.breakdown.overtime }] : []),
                ...(result.breakdown.night > 0 ? [{ label: '야간근로', value: result.breakdown.night }] : []),
                ...(result.breakdown.holiday > 0 ? [{ label: '휴일근로', value: result.breakdown.holiday }] : [])
              ].filter(item => item.value > 0)}
              title="수당 구성"
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

          <div className="mt-6">
            <AIAdviceSection 
              calculatorType="overtime-pay"
              result={result}
              inputs={{ hourlySalary, overtimeHours, nightHours, holidayHours }}
            />
          </div>
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

  const getTypeLabel = (type) => ({ 'annual-leave': '연차계산', 'severance-pay': '퇴직금계산', 'overtime-pay': '야근수당계산' }[type] || type);

  const getResultDisplay = (item) => {
    switch (item.type) {
      case 'annual-leave': return `${item.result.available}일`;
      case 'severance-pay': return `${(item.result.amount || 0).toLocaleString()}원`;
      case 'overtime-pay': return `${(item.result.totalAllowance || 0).toLocaleString()}원`;
      default: return '-';
    }
  };

  const filteredHistory = calculationHistory.filter(item => {
    const matchesSearch = searchTerm === '' || getTypeLabel(item.type).toLowerCase().includes(searchTerm.toLowerCase()) || item.timestamp.toLocaleDateString('ko-KR').includes(searchTerm);
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  if (calculationHistory.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border dark:border-gray-700 text-center">
        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">아직 계산 이력이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">계산 이력</h3>
        <button onClick={() => setCalculationHistory([])} className="text-xs text-gray-400 hover:text-red-500">전체삭제</button>
      </div>

      <div className="space-y-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="이력 검색..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
          <option value="all">전체 보기</option>
          <option value="annual-leave">연차계산</option>
          <option value="severance-pay">퇴직금계산</option>
          <option value="overtime-pay">야근수당계산</option>
        </select>
      </div>

      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-4"><p className="text-gray-500 dark:text-gray-400 text-sm">검색 결과가 없습니다</p></div>
        ) : (
          filteredHistory.slice(0, 10).map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{getTypeLabel(item.type)}</p>
                  <span className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200 px-2 py-1 rounded-full">{item.timestamp.toLocaleDateString('ko-KR')}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-blue-600 dark:text-blue-400 text-sm">{getResultDisplay(item)}</p>
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
    // PWA 설치 가능 상태 체크
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // PWA 설치 완료 체크
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    // 이미 설치되었는지 체크
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

  const handleIOSInstall = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      alert('📱 iPhone/iPad에서 설치하기:\n\n1. Safari에서 이 페이지를 엽니다\n2. 하단의 공유 버튼(⬆️)을 탭합니다\n3. "홈 화면에 추가"를 선택합니다\n4. "추가"를 탭하면 완료!');
    }
  };

  if (isInstalled) {
    return (
      <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-xl p-4 transition-colors">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-green-900 dark:text-green-200">앱 설치 완료!</h4>
            <p className="text-sm text-green-700 dark:text-green-300">AI노무사가 홈 화면에 추가되었습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isInstallable && !isInstalled) {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      return (
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl p-4 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">📱</span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 dark:text-blue-200">앱으로 설치하기</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">Safari에서 홈 화면에 추가할 수 있어요</p>
            </div>
            <MobileOptimizedButton onClick={handleIOSInstall} size="sm" variant="primary" className="text-xs">
              방법 보기
            </MobileOptimizedButton>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200 dark:border-purple-700 rounded-xl p-4 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">📱</span>
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-purple-900 dark:text-purple-200">앱으로 설치하기</h4>
          <p className="text-sm text-purple-700 dark:text-purple-300">홈 화면에 추가해서 더 빠르게 이용하세요!</p>
        </div>
        <MobileOptimizedButton onClick={handleInstallClick} size="sm" variant="primary" className="text-xs bg-gradient-to-r from-purple-500 to-pink-500">
          <Download className="w-3 h-3 mr-1" />
          설치
        </MobileOptimizedButton>
      </div>
    </div>
  );
};

// ==================== MAIN APP ====================
const EnhancedAILaborPlatform = () => {
  const { currentPage, currentCalculator, setCurrentPage, setCurrentCalculator, isMobileMenuOpen, setIsMobileMenuOpen } = useApp();

  // PWA 초기화
  useEffect(() => {
    // Manifest 동적 생성 및 추가
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

      // 메타 태그들 추가
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
    setIsMobileMenuOpen(false);
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
        <MobileNavigation isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} navigateTo={navigateTo} />
        <MobileHeader onMenuOpen={() => setIsMobileMenuOpen(true)} navigateTo={navigateTo} currentCalculator={currentCalculator} />
        <main className="max-w-4xl mx-auto p-4 pb-20 lg:pb-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div className="lg:col-span-2">{renderCalculator()}</div>
            <div className="hidden lg:block space-y-6">
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
      <MobileNavigation isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} navigateTo={navigateTo} />
      <MobileHeader onMenuOpen={() => setIsMobileMenuOpen(true)} navigateTo={navigateTo} currentCalculator={null} />

      <section className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white transition-colors">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">스마트한 노무 관리의<br />새로운 기준</h2>
            <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto">AI 기술로 더 쉽고 정확한 노무 업무를 경험하세요.</p>
          </div>

          {/* 하단 PWA 기능 소개 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-6 sm:p-8 mt-12 sm:mt-16 transition-colors">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">📱 앱처럼 사용하세요</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base transition-colors">홈 화면에 추가하고 더 빠르게 이용하세요</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 text-center hover:shadow-md transition-all">
                <div className="text-2xl mb-2">⚡</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm sm:text-base transition-colors">빠른 접근</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 transition-colors">홈 화면에서 바로 실행</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 text-center hover:shadow-md transition-all">
                <div className="text-2xl mb-2">📱</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm sm:text-base transition-colors">앱 경험</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 transition-colors">네이티브 앱처럼 동작</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 text-center hover:shadow-md transition-all">
                <div className="text-2xl mb-2">💾</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm sm:text-base transition-colors">오프라인</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 transition-colors">인터넷 없이도 일부 기능 사용</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* PWA 설치 프롬프트 */}
          <div className="mb-8">
            <PWAInstallPrompt />
          </div>

          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">노무 계산기</h3>
            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg transition-colors">필요한 모든 노무 계산을 한 곳에서</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Object.values(calculatorsData).map((calc) => {
              const IconComponent = calc.icon;
              return (
                <div key={calc.id} onClick={() => navigateTo(calc.id)} className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 cursor-pointer group active:scale-95">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${calc.color} rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors">{calc.title}</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 text-sm transition-colors">{calc.description}</p>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium text-sm transition-colors">
                    <span>계산하기</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 z-30 transition-colors">
        <div className="flex space-x-3">
          <MobileOptimizedButton onClick={() => navigateTo('annual-leave')} className="flex-1" variant="success">연차계산기</MobileOptimizedButton>
          <MobileOptimizedButton onClick={() => navigateTo('severance-pay')} className="flex-1" variant="warning">퇴직금계산기</MobileOptimizedButton>
        </div>
      </div>
    </div>
  );
};

// 토스트 알림 시스템
const NotificationToast = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastColor = (type) => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-amber-500';
      case 'error': return 'bg-red-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div 
      className={`fixed bottom-4 right-4 max-w-sm w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 transform transition-all duration-300 z-50 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      <div className={`w-full h-1 ${getToastColor(notification.type)} rounded-t-lg`}></div>
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <span className="text-lg flex-shrink-0">
            {notification.type === 'success' ? '✅' : 
             notification.type === 'warning' ? '⚠️' :
             notification.type === 'error' ? '❌' : 'ℹ️'}
          </span>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 dark:text-white text-sm">
              {notification.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {notification.message}
            </p>
          </div>
          <button 
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (notification) => {
    const id = Date.now();
    setToasts(prev => [...prev, { ...notification, id }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // 전역으로 사용할 수 있도록 window에 함수 등록
  useEffect(() => {
    window.showToast = addToast;
    return () => {
      delete window.showToast;
    };
  }, []);

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <NotificationToast
            key={toast.id}
            notification={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </>
  );
};

const App = () => {
  return (
    <AppProvider>
      <ToastProvider>
        <EnhancedAILaborPlatform />
      </ToastProvider>
    </AppProvider>
  );
};

export default App;