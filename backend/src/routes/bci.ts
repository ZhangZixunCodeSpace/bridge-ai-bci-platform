import express from 'express';
import { body, param, query } from 'express-validator';
import { validateRequest } from '../middleware/validation';
import { BCIController } from '../controllers/bciController';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

/**
 * @swagger
 * /api/bci/connect:
 *   post:
 *     summary: Connect to BCI device
 *     tags: [BCI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deviceType:
 *                 type: string
 *                 enum: [simulator, neurable, openbci, emotiv]
 *                 description: Type of BCI device to connect
 *               deviceId:
 *                 type: string
 *                 description: Optional device identifier
 *               simulationMode:
 *                 type: boolean
 *                 description: Whether to use simulation mode
 *     responses:
 *       200:
 *         description: BCI device connected successfully
 *       400:
 *         description: Invalid device configuration
 *       409:
 *         description: Device already connected
 */
router.post('/connect',
  [
    body('deviceType')
      .isIn(['simulator', 'neurable', 'openbci', 'emotiv'])
      .withMessage('Invalid device type'),
    body('simulationMode')
      .optional()
      .isBoolean()
      .withMessage('Simulation mode must be boolean'),
  ],
  validateRequest,
  asyncHandler(BCIController.connect)
);

/**
 * @swagger
 * /api/bci/disconnect:
 *   post:
 *     summary: Disconnect from BCI device
 *     tags: [BCI]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: BCI device disconnected successfully
 *       404:
 *         description: No active BCI connection found
 */
router.post('/disconnect',
  asyncHandler(BCIController.disconnect)
);

/**
 * @swagger
 * /api/bci/status:
 *   get:
 *     summary: Get BCI connection status
 *     tags: [BCI]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: BCI status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isConnected:
 *                   type: boolean
 *                 deviceType:
 *                   type: string
 *                 signalQuality:
 *                   type: number
 *                 lastUpdate:
 *                   type: string
 *                   format: date-time
 */
router.get('/status',
  asyncHandler(BCIController.getStatus)
);

/**
 * @swagger
 * /api/bci/calibrate:
 *   post:
 *     summary: Start BCI calibration process
 *     tags: [BCI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               duration:
 *                 type: number
 *                 description: Calibration duration in seconds
 *                 minimum: 30
 *                 maximum: 300
 *                 default: 120
 *               taskType:
 *                 type: string
 *                 enum: [baseline, stress, empathy, focus]
 *                 description: Type of calibration task
 *     responses:
 *       200:
 *         description: Calibration started successfully
 *       400:
 *         description: Invalid calibration parameters
 *       409:
 *         description: Calibration already in progress
 */
router.post('/calibrate',
  [
    body('duration')
      .optional()
      .isInt({ min: 30, max: 300 })
      .withMessage('Duration must be between 30 and 300 seconds'),
    body('taskType')
      .optional()
      .isIn(['baseline', 'stress', 'empathy', 'focus'])
      .withMessage('Invalid calibration task type'),
  ],
  validateRequest,
  asyncHandler(BCIController.startCalibration)
);

/**
 * @swagger
 * /api/bci/calibration/status:
 *   get:
 *     summary: Get calibration status
 *     tags: [BCI]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Calibration status retrieved successfully
 */
router.get('/calibration/status',
  asyncHandler(BCIController.getCalibrationStatus)
);

/**
 * @swagger
 * /api/bci/metrics:
 *   get:
 *     summary: Get current BCI metrics
 *     tags: [BCI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: realtime
 *         schema:
 *           type: boolean
 *         description: Whether to get real-time metrics
 *       - in: query
 *         name: duration
 *         schema:
 *           type: number
 *         description: Duration in seconds for historical metrics
 *     responses:
 *       200:
 *         description: BCI metrics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stress:
 *                   type: number
 *                   minimum: 0
 *                   maximum: 100
 *                 focus:
 *                   type: number
 *                   minimum: 0
 *                   maximum: 100
 *                 empathy:
 *                   type: number
 *                   minimum: 0
 *                   maximum: 100
 *                 regulation:
 *                   type: number
 *                   minimum: 0
 *                   maximum: 100
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/metrics',
  [
    query('realtime')
      .optional()
      .isBoolean()
      .withMessage('Realtime must be boolean'),
    query('duration')
      .optional()
      .isInt({ min: 1, max: 3600 })
      .withMessage('Duration must be between 1 and 3600 seconds'),
  ],
  validateRequest,
  asyncHandler(BCIController.getMetrics)
);

/**
 * @swagger
 * /api/bci/feedback:
 *   post:
 *     summary: Generate neural feedback based on current metrics
 *     tags: [BCI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               metrics:
 *                 type: object
 *                 properties:
 *                   stress:
 *                     type: number
 *                   empathy:
 *                     type: number
 *                   regulation:
 *                     type: number
 *               context:
 *                 type: string
 *                 description: Current training context
 *     responses:
 *       200:
 *         description: Neural feedback generated successfully
 */
router.post('/feedback',
  [
    body('metrics').isObject().withMessage('Metrics must be an object'),
    body('metrics.stress')
      .isFloat({ min: 0, max: 100 })
      .withMessage('Stress must be between 0 and 100'),
    body('metrics.empathy')
      .isFloat({ min: 0, max: 100 })
      .withMessage('Empathy must be between 0 and 100'),
    body('metrics.regulation')
      .isFloat({ min: 0, max: 100 })
      .withMessage('Regulation must be between 0 and 100'),
  ],
  validateRequest,
  asyncHandler(BCIController.generateFeedback)
);

/**
 * @swagger
 * /api/bci/sessions:
 *   get:
 *     summary: Get BCI session history
 *     tags: [BCI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 20
 *         description: Number of sessions to retrieve
 *       - in: query
 *         name: offset
 *         schema:
 *           type: number
 *           default: 0
 *         description: Number of sessions to skip
 *     responses:
 *       200:
 *         description: BCI sessions retrieved successfully
 */
router.get('/sessions',
  [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('offset')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Offset must be non-negative'),
  ],
  validateRequest,
  asyncHandler(BCIController.getSessions)
);

/**
 * @swagger
 * /api/bci/sessions/{sessionId}:
 *   get:
 *     summary: Get specific BCI session details
 *     tags: [BCI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: BCI session ID
 *     responses:
 *       200:
 *         description: BCI session details retrieved successfully
 *       404:
 *         description: Session not found
 */
router.get('/sessions/:sessionId',
  [
    param('sessionId')
      .isUUID()
      .withMessage('Session ID must be a valid UUID'),
  ],
  validateRequest,
  asyncHandler(BCIController.getSession)
);

export default router;