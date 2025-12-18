import React from 'react'
import { motion } from 'framer-motion'

export default function Addtask({ add, inputvalue, vlueofinput }) {
  return (
    <div className="add-task-container">
      <motion.input
        type="text"
        placeholder="Add a new task..."
        value={inputvalue}
        onChange={vlueofinput}
        onKeyDown={(e) => e.key === 'Enter' && add()}
        whileFocus={{ scale: 1.02, borderColor: "var(--accent-color)" }}
        transition={{ duration: 0.2 }}
      />
      <motion.button
        className="btn-add"
        onClick={add}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Add
      </motion.button>
    </div>
  )
}
