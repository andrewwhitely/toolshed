import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

const WELCOME_SEEN_KEY = 'toolshed-welcome-seen';

export function hasSeenWelcome(): boolean {
	return localStorage.getItem(WELCOME_SEEN_KEY) === 'true';
}

export function markWelcomeSeen(): void {
	localStorage.setItem(WELCOME_SEEN_KEY, 'true');
}

interface Props {
	open: boolean;
	onClose: () => void;
	onStartFresh: () => void;
	onExploreSample: () => void;
}

export function WelcomeModal({
	open,
	onClose,
	onStartFresh,
	onExploreSample,
}: Props) {
	function handleStartFresh() {
		markWelcomeSeen();
		onStartFresh();
		onClose();
	}

	function handleExploreSample() {
		markWelcomeSeen();
		onExploreSample();
		onClose();
	}

	return (
		<Modal open={open} onClose={onClose} width="min(420px, 94vw)" closeOnBackdrop={false}>
			<div className="text-center">
				<h2 className="font-serif text-[22px] sm:text-[26px] font-black text-[var(--ink)] mb-2">
					Welcome to <span className='text-[var(--ink)]'>Tool</span>
					<span className='text-[var(--accent)] transition-colors duration-300'>
						Shed
					</span>
				</h2>
				<p className="text-[11px] text-[var(--ink2)] leading-relaxed mb-3">
					Your tool inventory, projects, and posts are stored locally on
					this device. Nothing is sent to a server — your data stays with you.
				</p>
				<p className="text-[11px] text-[var(--ink2)] leading-relaxed mb-3">
					You can explore with sample data, or clear everything and start fresh.
				</p>
				<p className="text-[11px] text-[var(--ink2)] leading-relaxed mb-6">
					You can also export your data as JSON to back it up, or import it from a file to use on another device.
				</p>
				<div className="flex flex-col sm:flex-row gap-2.5">
					<Button
						variant="default"
						onClick={handleExploreSample}
						className="flex-1 w-full sm:w-auto"
					>
						Explore with sample data
					</Button>
					<Button
						variant="default"
						onClick={handleStartFresh}
						className="flex-1 w-full sm:w-auto"
					>
						Clear & start fresh
					</Button>
				</div>
			</div>
		</Modal>
	);
}
