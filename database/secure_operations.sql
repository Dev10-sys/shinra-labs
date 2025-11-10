-- ============================================
-- SHINRA LABS - SECURE OPERATIONS
-- Server-side validation for critical financial operations
-- ============================================

-- Secure withdrawal function
CREATE OR REPLACE FUNCTION secure_withdrawal(
  p_user_id UUID,
  p_amount NUMERIC,
  p_description TEXT
) RETURNS JSONB AS $$
DECLARE
  v_balance NUMERIC;
  v_transaction_id UUID;
BEGIN
  -- CRITICAL: Validate amount is positive
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Withdrawal amount must be positive';
  END IF;

  -- Check if caller is the user
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized withdrawal attempt';
  END IF;

  -- Get current balance with row lock
  SELECT balance INTO v_balance FROM users WHERE id = p_user_id FOR UPDATE;

  -- Validate sufficient balance
  IF v_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient balance. Available: ₹%, Requested: ₹%', v_balance, p_amount;
  END IF;

  -- Create transaction record (negative for withdrawal)
  INSERT INTO transactions (user_id, type, amount, description)
  VALUES (p_user_id, 'withdrawal', -p_amount, p_description)
  RETURNING id INTO v_transaction_id;

  -- Update balance atomically
  UPDATE users SET balance = balance - p_amount WHERE id = p_user_id;

  RETURN jsonb_build_object('success', true, 'transaction_id', v_transaction_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Secure purchase function
CREATE OR REPLACE FUNCTION secure_purchase(
  p_user_id UUID,
  p_dataset_id UUID
) RETURNS JSONB AS $$
DECLARE
  v_balance NUMERIC;
  v_purchase_id UUID;
  v_dataset_price NUMERIC;
  v_dataset_title TEXT;
  v_existing_purchase UUID;
BEGIN
  -- Check if caller is the user
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized purchase attempt';
  END IF;

  -- CRITICAL: Get the ACTUAL price from database, not client
  SELECT price, title INTO v_dataset_price, v_dataset_title
  FROM datasets WHERE id = p_dataset_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Dataset not found';
  END IF;

  -- Check for duplicate purchase
  SELECT id INTO v_existing_purchase
  FROM purchases
  WHERE buyer_id = p_user_id AND dataset_id = p_dataset_id
  LIMIT 1;

  IF v_existing_purchase IS NOT NULL THEN
    RAISE EXCEPTION 'Dataset already purchased';
  END IF;

  -- For paid datasets, validate balance and deduct
  IF v_dataset_price > 0 THEN
    SELECT balance INTO v_balance FROM users WHERE id = p_user_id FOR UPDATE;

    IF v_balance < v_dataset_price THEN
      RAISE EXCEPTION 'Insufficient balance. Available: ₹%, Required: ₹%', v_balance, v_dataset_price;
    END IF;

    -- Deduct balance
    UPDATE users SET balance = balance - v_dataset_price WHERE id = p_user_id;

    -- Create transaction record
    INSERT INTO transactions (user_id, type, amount, description)
    VALUES (p_user_id, 'purchase', -v_dataset_price, 'Dataset purchase: ' || v_dataset_title);
  END IF;

  -- Create purchase record
  INSERT INTO purchases (buyer_id, dataset_id, amount_paid)
  VALUES (p_user_id, p_dataset_id, v_dataset_price)
  RETURNING id INTO v_purchase_id;

  -- Increment downloads
  UPDATE datasets SET downloads = downloads + 1 WHERE id = p_dataset_id;

  RETURN jsonb_build_object(
    'success', true,
    'purchase_id', v_purchase_id,
    'amount_paid', v_dataset_price
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Secure admin approval function
CREATE OR REPLACE FUNCTION secure_approve_submission(
  p_submission_id UUID
) RETURNS JSONB AS $$
DECLARE
  v_freelancer_id UUID;
  v_task_id UUID;
  v_payout NUMERIC;
  v_task_title TEXT;
  v_current_status TEXT;
BEGIN
  -- CRITICAL: Check if caller is admin
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Only admins can approve submissions';
  END IF;

  -- Get submission details with lock
  SELECT freelancer_id, task_id, status INTO v_freelancer_id, v_task_id, v_current_status
  FROM submissions WHERE id = p_submission_id FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Submission not found';
  END IF;

  -- CRITICAL: Prevent duplicate approval
  IF v_current_status = 'approved' THEN
    RAISE EXCEPTION 'Submission already approved';
  END IF;

  IF v_current_status = 'rejected' THEN
    RAISE EXCEPTION 'Cannot approve rejected submission';
  END IF;

  -- Get task payout from database
  SELECT payout, title INTO v_payout, v_task_title
  FROM tasks WHERE id = v_task_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Task not found';
  END IF;

  -- CRITICAL: Validate payout is positive
  IF v_payout <= 0 THEN
    RAISE EXCEPTION 'Invalid task payout amount';
  END IF;

  -- Update submission status
  UPDATE submissions 
  SET status = 'approved', verified = true, updated_at = NOW()
  WHERE id = p_submission_id;

  -- Credit freelancer atomically
  UPDATE users 
  SET 
    balance = balance + v_payout,
    total_earned = total_earned + v_payout,
    tasks_completed = tasks_completed + 1
  WHERE id = v_freelancer_id;

  -- Create earning transaction
  INSERT INTO transactions (user_id, type, amount, description)
  VALUES (v_freelancer_id, 'earning', v_payout, 'Task completed: ' || v_task_title);

  -- Create notification
  INSERT INTO notifications (user_id, type, title, message)
  VALUES (v_freelancer_id, 'payment', 'Submission Approved', 
          'Earned ₹' || v_payout || ' for ' || v_task_title);

  RETURN jsonb_build_object('success', true, 'payout', v_payout);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
