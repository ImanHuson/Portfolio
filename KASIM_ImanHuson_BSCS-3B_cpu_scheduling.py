"""
=============================================================
  CPU Scheduling Algorithms Simulator
  Implements: FCFS, SJF, SRT, RR, Priority (Non-Preemptive),
              Priority (Preemptive), Priority with Round Robin
=============================================================
"""

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np


# ─────────────────────────────────────────────
#  INPUT HANDLING
# ─────────────────────────────────────────────

def get_processes(need_priority=False, need_quantum=False):
    """
    Collect process data from the user.
    Returns a list of process dictionaries and optionally a time quantum.
    Each process dict contains: pid, at (arrival), bt (burst), priority.
    """
    while True:
        try:
            n = int(input("\nEnter number of processes (minimum 3): "))
            if n < 3:
                print("  ❌ Must have at least 3 processes. Try again.")
            else:
                break
        except ValueError:
            print("  ❌ Please enter a valid integer.")

    processes = []
    print(f"\nEnter details for each process:")
    if need_priority:
        print(f"  (Priority: lower number = higher priority, e.g., 1 > 2 > 3)\n")
    else:
        print()

    for i in range(n):
        pid = f"P{i+1}"
        print(f"  --- Process {pid} ---")

        while True:
            try:
                at = int(input(f"    Arrival Time : "))
                if at < 0:
                    print("    ❌ Arrival time cannot be negative.")
                else:
                    break
            except ValueError:
                print("    ❌ Enter a valid integer.")

        while True:
            try:
                bt = int(input(f"    Burst Time   : "))
                if bt <= 0:
                    print("    ❌ Burst time must be greater than 0.")
                else:
                    break
            except ValueError:
                print("    ❌ Enter a valid integer.")

        priority = 0
        if need_priority:
            while True:
                try:
                    priority = int(input(f"    Priority     : "))
                    if priority < 0:
                        print("    ❌ Priority cannot be negative.")
                    else:
                        break
                except ValueError:
                    print("    ❌ Enter a valid integer.")

        processes.append({"pid": pid, "at": at, "bt": bt, "priority": priority})

    quantum = 0
    if need_quantum:
        while True:
            try:
                quantum = int(input(f"\nEnter Time Quantum: "))
                if quantum <= 0:
                    print("  ❌ Time quantum must be greater than 0.")
                else:
                    break
            except ValueError:
                print("  ❌ Enter a valid integer.")

    return processes, quantum


# ─────────────────────────────────────────────
#  OUTPUT: GANTT CHART + RESULTS TABLE
# ─────────────────────────────────────────────

def merge_gantt(gantt_log):
    """Merge consecutive segments of the same process into one block."""
    merged = []
    for pid, start, end in gantt_log:
        if merged and merged[-1][0] == pid and merged[-1][2] == start:
            merged[-1] = (pid, merged[-1][1], end)
        else:
            merged.append([pid, start, end])
    return [(pid, s, e) for pid, s, e in merged]


def display_results(algorithm_name, processes, gantt_log):
    """
    Compute WT and TAT for each process from the gantt_log,
    then display a matplotlib Gantt chart and a results table.

    gantt_log: list of (pid, start_time, end_time)
    """

    # ── Compute finish time per process (last end time in gantt log)
    finish_times = {}
    for pid, start, end in gantt_log:
        finish_times[pid] = max(finish_times.get(pid, 0), end)

    # ── Compute WT and TAT
    results = []
    total_wt = 0
    total_tat = 0
    for p in processes:
        pid  = p["pid"]
        at   = p["at"]
        bt   = p["bt"]
        ft   = finish_times[pid]
        tat  = ft - at            # Turnaround Time = Finish - Arrival
        wt   = tat - bt           # Waiting Time    = TAT - Burst
        total_wt  += wt
        total_tat += tat
        results.append({"pid": pid, "at": at, "bt": bt, "ft": ft, "tat": tat, "wt": wt})

    n = len(processes)
    avg_wt  = total_wt  / n
    avg_tat = total_tat / n

    # ── Print to terminal (same column order as chart table)
    # Columns: Process | Burst Time | Priority | Arrival Time | Waiting Time | Turnaround Time
    pri_map = {p["pid"]: p["priority"] for p in processes}
    print(f"\n{'='*63}")
    print(f"  Results — {algorithm_name}")
    print(f"{'='*63}")
    print(f"  {'Process':<10} {'BT':>4} {'Priority':>10} {'AT':>6} {'WT':>6} {'TAT':>6}")
    print(f"  {'-'*54}")
    for r in results:
        print(f"  {r['pid']:<10} {r['bt']:>4} {pri_map[r['pid']]:>10} {r['at']:>6} {r['wt']:>6} {r['tat']:>6}")
    print(f"  {'-'*54}")
    print(f"  {'Average':<10} {'—':>4} {'—':>10} {'—':>6} {avg_wt:>6.2f} {avg_tat:>6.2f}")
    print(f"{'='*63}")

    # ── Build the figure
    colors = plt.cm.Set3.colors  # distinct pastel colors for processes
    pid_list = [p["pid"] for p in processes]
    color_map = {pid: colors[i % len(colors)] for i, pid in enumerate(pid_list)}

    fig = plt.figure(figsize=(14, 8))
    fig.suptitle(f"CPU Scheduling — {algorithm_name}", fontsize=14, fontweight="bold", y=0.98)

    # ── TOP: Gantt Chart
    ax_gantt = fig.add_axes([0.05, 0.55, 0.90, 0.35])
    ax_gantt.set_title("Gantt Chart", fontsize=11, pad=8)
    ax_gantt.set_ylim(0, 2)
    ax_gantt.set_yticks([])

    # Draw each block
    for pid, start, end in gantt_log:
        duration = end - start
        ax_gantt.broken_barh(
            [(start, duration)], (0.3, 1.4),
            facecolors=color_map[pid],
            edgecolors="black",
            linewidth=1.2
        )
        # Label inside block
        ax_gantt.text(
            start + duration / 2, 1.0, pid,
            ha="center", va="center",
            fontsize=9, fontweight="bold"
        )

    # Time markers
    time_points = sorted(set([s for _, s, _ in gantt_log] + [e for _, _, e in gantt_log]))
    ax_gantt.set_xticks(time_points)
    ax_gantt.set_xticklabels([str(t) for t in time_points], fontsize=8)
    ax_gantt.set_xlim(0, time_points[-1])
    ax_gantt.set_xlabel("Time", fontsize=9)
    ax_gantt.grid(axis="x", linestyle="--", alpha=0.5)

    # Legend
    legend_patches = [mpatches.Patch(color=color_map[pid], label=pid) for pid in pid_list]
    ax_gantt.legend(handles=legend_patches, loc="upper right", fontsize=8, framealpha=0.7)

    # ── BOTTOM: Results Table
    ax_table = fig.add_axes([0.05, 0.05, 0.90, 0.42])
    ax_table.axis("off")
    ax_table.set_title("Results Summary", fontsize=11, pad=8)

    col_labels = ["Process", "Burst Time", "Priority", "Arrival Time", "Waiting Time", "Turnaround Time"]
    table_data = [[r["pid"], r["bt"], processes[[p["pid"] for p in processes].index(r["pid"])]["priority"], r["at"], r["wt"], r["tat"]] for r in results]
    table_data.append(["Average", "—", "—", "—", f"{avg_wt:.2f}", f"{avg_tat:.2f}"])

    table = ax_table.table(
        cellText=table_data,
        colLabels=col_labels,
        loc="center",
        cellLoc="center"
    )
    table.auto_set_font_size(False)
    table.set_fontsize(10)
    table.scale(1.2, 1.8)

    # Style header row
    for j in range(len(col_labels)):
        table[0, j].set_facecolor("#2c3e50")
        table[0, j].set_text_props(color="white", fontweight="bold")

    # Style average row
    avg_row = len(table_data)
    for j in range(len(col_labels)):
        table[avg_row, j].set_facecolor("#d5e8d4")
        table[avg_row, j].set_text_props(fontweight="bold")

    # Alternate row colors
    for i in range(1, len(results) + 1):
        bg = "#f9f9f9" if i % 2 == 0 else "#ffffff"
        for j in range(len(col_labels)):
            table[i, j].set_facecolor(bg)

    import os, time
    script_dir = os.path.dirname(os.path.abspath(__file__))
    base_name  = algorithm_name.replace(' ', '_').replace('–','').replace('(','').replace(')','')
    timestamp  = time.strftime("%H%M%S")
    filename   = f"{base_name}_{timestamp}.png"
    save_path  = os.path.join(script_dir, filename)

    # ── Save chart image
    try:
        plt.savefig(save_path, dpi=150, bbox_inches="tight")
    except Exception as e:
        print(f"\n  ⚠️  Could not save chart image: {e}")
    finally:
        try:
            plt.close('all')
        except Exception:
            pass

    # ── Open chart inside VS Code as an image tab (non-blocking)
    # Falls back to the system default viewer if 'code' CLI is not available
    import subprocess
    opened = False
    try:
        result = subprocess.run(['code', save_path], capture_output=True)
        if result.returncode == 0:
            print(f"\n  📊 Chart opened in VS Code → {filename}")
            print(f"  (View the chart tab in VS Code, then come back here)")
            opened = True
    except FileNotFoundError:
        pass  # 'code' CLI not found, will try fallback

    if not opened:
        # Fallback: open with system default image viewer
        try:
            import sys
            if sys.platform == 'darwin':
                subprocess.Popen(['open', save_path])
            elif sys.platform == 'win32':
                os.startfile(save_path)
            else:
                subprocess.Popen(['xdg-open', save_path])
            print(f"\n  📊 Chart opened in default viewer → {filename}")
        except Exception as e:
            print(f"\n  📊 Chart saved → {save_path}")
            print(f"  (Open the file manually to view it)")




# ─────────────────────────────────────────────
#  ALGORITHM 1: FCFS
# ─────────────────────────────────────────────

def fcfs(processes):
    """
    First-Come, First-Served (FCFS) — Non-Preemptive
    Processes are executed in the order they arrive.
    Simple but can cause the 'convoy effect' (short jobs wait behind long ones).
    """
    procs = sorted(processes, key=lambda p: (p["at"], p["pid"]))
    gantt_log = []
    current_time = 0

    for p in procs:
        # If CPU is idle, jump to the next arrival
        if current_time < p["at"]:
            current_time = p["at"]
        start = current_time
        end   = current_time + p["bt"]
        gantt_log.append((p["pid"], start, end))
        current_time = end

    display_results("FCFS", processes, merge_gantt(gantt_log))


# ─────────────────────────────────────────────
#  ALGORITHM 2: SJF (Non-Preemptive)
# ─────────────────────────────────────────────

def sjf_non_preemptive(processes):
    """
    Shortest Job First (SJF) — Non-Preemptive
    At each scheduling point, the process with the shortest burst time
    among all arrived processes is selected. Once started, it runs to completion.
    Optimal for minimizing average waiting time but can cause starvation.
    """
    procs = [p.copy() for p in processes]
    gantt_log = []
    current_time = 0
    completed = []

    while len(completed) < len(procs):
        # Processes that have arrived and are not yet completed
        available = [p for p in procs if p["at"] <= current_time and p["pid"] not in completed]

        if not available:
            # CPU idle — jump to nearest arrival
            current_time = min(p["at"] for p in procs if p["pid"] not in completed)
            continue

        # Pick shortest burst time (tie-break: arrival time, then pid)
        selected = min(available, key=lambda p: (p["bt"], p["at"], p["pid"]))
        start = current_time
        end   = current_time + selected["bt"]
        gantt_log.append((selected["pid"], start, end))
        current_time = end
        completed.append(selected["pid"])

    display_results("SJF – Non-Preemptive", processes, merge_gantt(gantt_log))


# ─────────────────────────────────────────────
#  ALGORITHM 3: SRT (Preemptive SJF)
# ─────────────────────────────────────────────

def srt_preemptive(processes):
    """
    Shortest Remaining Time (SRT) — Preemptive
    Preemptive version of SJF. At each time unit, the process with the
    shortest remaining burst time runs. New arrivals can preempt the current process.
    Minimizes average waiting time but has high context-switching overhead.
    """
    procs = [p.copy() for p in processes]
    for p in procs:
        p["remaining"] = p["bt"]

    gantt_log = []
    current_time = 0
    completed = []
    prev_pid = None
    seg_start = 0

    total_bt = sum(p["bt"] for p in procs)

    while len(completed) < len(procs):
        available = [p for p in procs if p["at"] <= current_time and p["pid"] not in completed]

        if not available:
            current_time += 1
            continue

        # Select process with shortest remaining time
        selected = min(available, key=lambda p: (p["remaining"], p["at"], p["pid"]))

        # Track Gantt segments (merge consecutive same-process slots)
        if selected["pid"] != prev_pid:
            if prev_pid is not None:
                gantt_log.append((prev_pid, seg_start, current_time))
            seg_start = current_time
            prev_pid = selected["pid"]

        selected["remaining"] -= 1
        current_time += 1

        if selected["remaining"] == 0:
            completed.append(selected["pid"])
            gantt_log.append((selected["pid"], seg_start, current_time))
            prev_pid = None

    display_results("SRT – Preemptive", processes, merge_gantt(gantt_log))


# ─────────────────────────────────────────────
#  ALGORITHM 4: Round Robin
# ─────────────────────────────────────────────

def round_robin(processes, quantum):
    """
    Round Robin (RR) — Preemptive
    Each process gets a fixed time slice (quantum). If not finished,
    it goes to the back of the ready queue. Fair scheduling — no starvation.
    Performance depends heavily on the quantum size.
    """
    from collections import deque
    procs = [p.copy() for p in processes]
    for p in procs:
        p["remaining"] = p["bt"]

    procs_sorted = sorted(procs, key=lambda p: p["at"])
    gantt_log = []
    current_time = 0
    queue = deque()
    arrived = set()
    completed = []

    # Seed the queue with processes arriving at time 0
    for p in procs_sorted:
        if p["at"] <= current_time:
            queue.append(p)
            arrived.add(p["pid"])

    while len(completed) < len(procs):
        if not queue:
            # CPU idle
            current_time += 1
            for p in procs_sorted:
                if p["pid"] not in arrived and p["at"] <= current_time:
                    queue.append(p)
                    arrived.add(p["pid"])
            continue

        current = queue.popleft()
        run_time = min(quantum, current["remaining"])
        start = current_time
        end   = current_time + run_time

        gantt_log.append((current["pid"], start, end))
        current["remaining"] -= run_time
        current_time = end

        # Enqueue any new arrivals during this slice
        for p in procs_sorted:
            if p["pid"] not in arrived and p["at"] <= current_time:
                queue.append(p)
                arrived.add(p["pid"])

        if current["remaining"] == 0:
            completed.append(current["pid"])
        else:
            queue.append(current)

    display_results(f"Round Robin (Quantum={quantum})", processes, merge_gantt(gantt_log))


# ─────────────────────────────────────────────
#  ALGORITHM 5: Priority Scheduling (Non-Preemptive)
# ─────────────────────────────────────────────

def priority_non_preemptive(processes):
    """
    Priority Scheduling — Non-Preemptive
    At each scheduling point, the process with the highest priority
    (lowest priority number) among arrived processes is selected.
    Once a process starts, it runs to completion.
    Can cause starvation of low-priority processes.
    Lower number = higher priority.
    """
    procs = [p.copy() for p in processes]
    gantt_log = []
    current_time = 0
    completed = []

    while len(completed) < len(procs):
        available = [p for p in procs if p["at"] <= current_time and p["pid"] not in completed]

        if not available:
            current_time = min(p["at"] for p in procs if p["pid"] not in completed)
            continue

        # Lower priority number = higher priority; tie-break: arrival, then pid
        selected = min(available, key=lambda p: (p["priority"], p["at"], p["pid"]))
        start = current_time
        end   = current_time + selected["bt"]
        gantt_log.append((selected["pid"], start, end))
        current_time = end
        completed.append(selected["pid"])

    display_results("Priority – Non-Preemptive", processes, merge_gantt(gantt_log))


# ─────────────────────────────────────────────
#  ALGORITHM 6: Priority Scheduling (Preemptive)
# ─────────────────────────────────────────────

def priority_preemptive(processes):
    """
    Priority Scheduling — Preemptive
    At each time unit, the process with the highest priority
    (lowest priority number) among arrived processes runs.
    A new arrival with higher priority preempts the current process.
    Can still cause starvation for low-priority processes.
    Lower number = higher priority.
    """
    procs = [p.copy() for p in processes]
    for p in procs:
        p["remaining"] = p["bt"]

    gantt_log = []
    current_time = 0
    completed = []
    prev_pid = None
    seg_start = 0

    while len(completed) < len(procs):
        available = [p for p in procs if p["at"] <= current_time and p["pid"] not in completed]

        if not available:
            current_time += 1
            continue

        # Select highest priority (lowest number); tie-break: arrival, pid
        selected = min(available, key=lambda p: (p["priority"], p["at"], p["pid"]))

        if selected["pid"] != prev_pid:
            if prev_pid is not None:
                gantt_log.append((prev_pid, seg_start, current_time))
            seg_start = current_time
            prev_pid = selected["pid"]

        selected["remaining"] -= 1
        current_time += 1

        if selected["remaining"] == 0:
            completed.append(selected["pid"])
            gantt_log.append((selected["pid"], seg_start, current_time))
            prev_pid = None

    display_results("Priority – Preemptive", processes, merge_gantt(gantt_log))


# ─────────────────────────────────────────────
#  ALGORITHM 7: Priority Scheduling with Round Robin
# ─────────────────────────────────────────────

def priority_round_robin(processes, quantum):
    """
    Priority Scheduling with Round Robin
    Processes are grouped by priority level. Within the same priority group,
    Round Robin scheduling (with a given time quantum) is applied.
    Higher priority groups are served first. Balances priority enforcement
    with fairness within the same priority level.
    Lower number = higher priority.
    """
    from collections import deque

    procs = [p.copy() for p in processes]
    for p in procs:
        p["remaining"] = p["bt"]

    # Get all unique priority levels sorted (lowest number = highest priority first)
    priority_levels = sorted(set(p["priority"] for p in procs))

    gantt_log = []
    current_time = 0
    completed = []
    arrived = set()

    procs_sorted = sorted(procs, key=lambda p: p["at"])

    while len(completed) < len(procs):
        # Find all arrived, uncompleted processes
        for p in procs_sorted:
            if p["pid"] not in arrived and p["at"] <= current_time:
                arrived.add(p["pid"])

        uncompleted = [p for p in procs if p["pid"] not in completed]
        if not uncompleted:
            break

        arrived_procs = [p for p in uncompleted if p["pid"] in arrived]

        if not arrived_procs:
            # CPU idle — jump to next arrival
            current_time = min(p["at"] for p in uncompleted)
            continue

        # Identify highest priority level currently in the ready queue
        top_priority = min(p["priority"] for p in arrived_procs)
        top_group = deque(p for p in arrived_procs if p["priority"] == top_priority)

        # Process one RR cycle for the top-priority group
        next_group = deque()
        while top_group:
            current = top_group.popleft()
            if current["pid"] in completed:
                continue

            run_time = min(quantum, current["remaining"])
            start = current_time
            end   = current_time + run_time

            gantt_log.append((current["pid"], start, end))
            current["remaining"] -= run_time
            current_time = end

            # Check for new arrivals
            for p in procs_sorted:
                if p["pid"] not in arrived and p["at"] <= current_time:
                    arrived.add(p["pid"])
                    # Add to top group only if same priority
                    if p["priority"] == top_priority and p["pid"] not in completed:
                        top_group.append(p)

            if current["remaining"] == 0:
                completed.append(current["pid"])
            else:
                next_group.append(current)

        # Re-add unfinished processes of the same priority back for next cycle
        # (they will be picked up in the next outer while iteration naturally)

    display_results(f"Priority + Round Robin (Quantum={quantum})", processes, merge_gantt(gantt_log))


# ─────────────────────────────────────────────
#  MAIN MENU
# ─────────────────────────────────────────────

def main():
    """
    Main entry point. Displays the menu and routes to the selected algorithm.
    """
    print("\n" + "="*55)
    print("       CPU SCHEDULING ALGORITHMS SIMULATOR")
    print("="*55)
    print("  Priority Convention: Lower number = Higher priority")
    print("  (e.g., Priority 1 is higher than Priority 3)")
    print("="*55)

    menu = {
        "1": ("First-Come, First-Served (FCFS)",               False, False),
        "2": ("Shortest Job First – Non-Preemptive (SJF)",     False, False),
        "3": ("Shortest Remaining Time – Preemptive (SRT)",    False, False),
        "4": ("Round Robin (RR)",                              False, True),
        "5": ("Priority Scheduling – Non-Preemptive",          True,  False),
        "6": ("Priority Scheduling – Preemptive",              True,  False),
        "7": ("Priority Scheduling with Round Robin",          True,  True),
        "0": ("Exit",                                          False, False),
    }

    saved_processes = None   # stores last entered process list for reuse
    saved_quantum   = 0      # stores last entered quantum for reuse
    auto_reuse      = False  # True when user chose "run another with same processes"

    while True:
        print("\n  Select an Algorithm:")
        for key, (name, _, _) in menu.items():
            print(f"    [{key}] {name}")

        choice = input("\n  Enter choice: ").strip()

        if choice == "0":
            print("\n  Exiting simulator. Goodbye!\n")
            break
        elif choice not in menu:
            print("  ❌ Invalid choice. Please try again.")
            continue

        name, need_priority, need_quantum = menu[choice]
        print(f"\n  ── {name} ──")
        print(f"  (Lower priority number = Higher priority)\n") if need_priority else None

        # ── Determine processes to use
        if auto_reuse and saved_processes is not None:
            # User already confirmed they want the same processes — use them directly
            processes = [p.copy() for p in saved_processes]

            # Handle quantum: reuse or ask for new one if needed
            if need_quantum:
                if saved_quantum:
                    ans_q = input(f"  Keep the same quantum ({saved_quantum})? (y/n): ").strip().lower()
                    if ans_q == 'y':
                        quantum = saved_quantum
                    else:
                        while True:
                            try:
                                quantum = int(input("  Enter new Time Quantum: "))
                                if quantum <= 0:
                                    print("  ❌ Time quantum must be greater than 0.")
                                else:
                                    break
                            except ValueError:
                                print("  ❌ Enter a valid integer.")
                        saved_quantum = quantum
                else:
                    while True:
                        try:
                            quantum = int(input("  Enter Time Quantum: "))
                            if quantum <= 0:
                                print("  ❌ Time quantum must be greater than 0.")
                            else:
                                break
                        except ValueError:
                            print("  ❌ Enter a valid integer.")
                    saved_quantum = quantum
            else:
                quantum = 0

            # If switching to a priority algorithm and priorities not yet set, ask only for those
            if need_priority and all(p['priority'] == 0 for p in processes):
                print("  This algorithm needs priority values. Please enter them:")
                for p in processes:
                    while True:
                        try:
                            p['priority'] = int(input(f"    Priority for {p['pid']}: "))
                            if p['priority'] < 0:
                                print("    ❌ Priority cannot be negative.")
                            else:
                                break
                        except ValueError:
                            print("    ❌ Enter a valid integer.")
                saved_processes = [p.copy() for p in processes]

        else:
            # Fresh input
            processes, quantum = get_processes(need_priority=need_priority, need_quantum=need_quantum)
            saved_processes = [p.copy() for p in processes]
            saved_quantum   = quantum

        auto_reuse = False  # reset after use

        # ── Run selected algorithm
        try:
            if   choice == "1": fcfs(processes)
            elif choice == "2": sjf_non_preemptive(processes)
            elif choice == "3": srt_preemptive(processes)
            elif choice == "4": round_robin(processes, quantum)
            elif choice == "5": priority_non_preemptive(processes)
            elif choice == "6": priority_preemptive(processes)
            elif choice == "7": priority_round_robin(processes, quantum)
        except Exception as e:
            print(f"\n  ⚠️  An error occurred during simulation: {e}")

        # ── Ask what to do next
        print("\n  What would you like to do next?")
        print("    [1] Run another algorithm (same processes)")
        print("    [2] Start over with new processes")
        print("    [0] Exit")

        while True:
            next_action = input("\n  Enter choice: ").strip()
            if next_action in ("0", "1", "2"):
                break
            print("  ❌ Invalid choice. Please enter 0, 1, or 2.")

        if next_action == "0":
            print("\n  Exiting simulator. Goodbye!\n")
            break
        elif next_action == "1":
            auto_reuse = True    # reuse saved processes on next loop
        elif next_action == "2":
            saved_processes = None
            saved_quantum   = 0
            auto_reuse      = False  # will ask for fresh input


# ─────────────────────────────────────────────
#  ENTRY POINT
# ─────────────────────────────────────────────

if __name__ == "__main__":
    main()
