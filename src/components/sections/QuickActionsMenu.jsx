import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const actions = [
  {
    label: 'Add Prompt',
    icon: '➕',
    to: '/add',
  },
  {
    label: 'Try Prompt',
    icon: '⚡',
    to: '/playground',
  },
  {
    label: 'Get Feedback',
    icon: '🔍',
    action: 'feedback', // will call a prop
  },
  {
    label: 'Billing',
    icon: '💳',
    to: '/billing',
  },
  {
    label: 'Profile Settings',
    icon: '⚙️',
    to: '/settings',
  },
];

export default function QuickActionsMenu({ onFeedback }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleAction = (action) => {
    setOpen(false);
    if (action.to) {
      navigate(action.to);
    } else if (action.action === 'feedback' && onFeedback) {
      onFeedback();
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="mb-4 flex flex-col gap-3"
          >
            {actions.map((action, i) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ delay: 0.05 * i }}
                onClick={() => handleAction(action)}
                className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-lg hover:scale-105 hover:from-blue-700 hover:to-cyan-700 transition-all"
              >
                <span className="text-xl">{action.icon}</span> {action.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen((v) => !v)}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 text-white text-4xl flex items-center justify-center shadow-2xl hover:from-blue-700 hover:to-cyan-700 transition-all focus:outline-none"
        aria-label="Quick Actions"
      >
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          +
        </motion.span>
      </motion.button>
    </div>
  );
} 