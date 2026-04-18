import os

services_dir = "k8s/services"
files = [f for f in os.listdir(services_dir) if f.endswith(".yaml")]

for filename in files:
    path = os.path.join(services_dir, filename)
    with open(path, 'r') as f:
        lines = f.readlines()

    new_lines = []
    in_service = False
    in_deployment = False
    container_port = "8080" # Default

    # Extract port from current file (it usually appears later)
    for line in lines:
        if "containerPort:" in line or "port:" in line:
            parts = line.split(":")
            if len(parts) > 1:
                val = parts[1].strip()
                if val.isdigit():
                    container_port = val

    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Detect context
        if "kind: Deployment" in line:
            in_deployment = True
            in_service = False
        elif "kind: Service" in line:
            in_service = True
            in_deployment = False
        
        # Deployment Fix: Move containerPort to ports block
        if in_deployment and "          ports:" in line:
            new_lines.append(line)
            new_lines.append(f"            - containerPort: {container_port}\n")
            i += 1
            # Skip the next line if it's the empty resources block or misplaced port
            while i < len(lines) and ("containerPort:" in lines[i] or "resources:" in lines[i]):
                if "resources:" in lines[i]: break
                i += 1
            continue

        # Service Fix: Remove resources block
        if in_service and "          resources:" in line:
            # Skip the resources block entirely for a Service
            i += 1
            while i < len(lines) and ("requests:" in lines[i] or "memory:" in lines[i] or "cpu:" in lines[i] or "limits:" in lines[i]):
                i += 1
            continue
            
        # Deployment: Remove the misplaced containerPort later in the block
        if in_deployment and "            - containerPort:" in line:
            i += 1
            continue

        new_lines.append(line)
        i += 1

    with open(path, 'w') as f:
        f.writelines(new_lines)

print(f"Repaired {len(files)} manifests.")
