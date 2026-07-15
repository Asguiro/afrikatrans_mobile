import {shouldScheduleBackgroundLock} from '../src/utils/appLockLifecycle';
import {useAppLockGateStore} from '../src/stores/appLockGateStore';

describe('shouldScheduleBackgroundLock', () => {
  it('schedules on active → background (Android path)', () => {
    expect(shouldScheduleBackgroundLock('active', 'background')).toBe(true);
  });

  it('schedules on inactive → background (iOS path)', () => {
    expect(shouldScheduleBackgroundLock('inactive', 'background')).toBe(true);
  });

  it('does not schedule on active → inactive alone', () => {
    expect(shouldScheduleBackgroundLock('active', 'inactive')).toBe(false);
  });

  it('does not re-schedule while already in background', () => {
    expect(shouldScheduleBackgroundLock('background', 'background')).toBe(
      false,
    );
  });

  it('does not schedule when returning to active', () => {
    expect(shouldScheduleBackgroundLock('background', 'active')).toBe(false);
    expect(shouldScheduleBackgroundLock('inactive', 'active')).toBe(false);
  });
});

describe('appLockGateStore', () => {
  beforeEach(() => {
    useAppLockGateStore.setState({
      suppressCount: 0,
      unlockCooldownUntil: 0,
    });
  });

  it('skips lock while suppressed', () => {
    const gate = useAppLockGateStore.getState();
    expect(gate.shouldSkipBackgroundLock()).toBe(false);
    gate.beginSuppress();
    expect(gate.shouldSkipBackgroundLock()).toBe(true);
    expect(gate.isSuppressed()).toBe(true);
    gate.endSuppress();
    expect(gate.shouldSkipBackgroundLock()).toBe(false);
  });

  it('nests suppress counts', () => {
    const gate = useAppLockGateStore.getState();
    gate.beginSuppress();
    gate.beginSuppress();
    gate.endSuppress();
    expect(gate.isSuppressed()).toBe(true);
    gate.endSuppress();
    expect(gate.isSuppressed()).toBe(false);
  });

  it('does not go below zero suppress', () => {
    const gate = useAppLockGateStore.getState();
    gate.endSuppress();
    expect(useAppLockGateStore.getState().suppressCount).toBe(0);
  });

  it('skips lock during unlock cooldown', () => {
    const gate = useAppLockGateStore.getState();
    gate.markUnlocked(5_000);
    expect(gate.shouldSkipBackgroundLock()).toBe(true);
    expect(gate.isInUnlockCooldown()).toBe(true);
  });

  it('allows lock after cooldown expires', () => {
    useAppLockGateStore.setState({
      suppressCount: 0,
      unlockCooldownUntil: Date.now() - 1,
    });
    expect(useAppLockGateStore.getState().shouldSkipBackgroundLock()).toBe(
      false,
    );
  });
});
