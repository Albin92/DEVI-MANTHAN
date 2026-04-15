import { motion } from 'framer-motion';
import Events from '../components/Events';
export default function EventsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.5 }}
      style={{flexGrow: 1}}
    >
      <div style={{height: '110px'}}></div>
      <Events />
      <div style={{height: '40px'}}></div>
    </motion.div>
  );
}
